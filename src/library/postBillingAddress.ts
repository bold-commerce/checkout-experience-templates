import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    getBillingAddress,
    IApiReturnObject,
    setBillingAddress,
    IAddress,
} from '@boldcommerce/checkout-frontend-library';
import {compareAddresses, handleErrorIfNeeded} from 'src/utils';
import {API_RETRY, Constants, defaultAddressState} from 'src/constants';
import {actionSetAppStateValid} from 'src/action';
import {setBillingAddressAsValid} from 'src/library';

export async function postBillingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    dispatch(actionSetAppStateValid('billingAddress', false));
    const previousBilling: IAddress = getBillingAddress();
    const {data: {application_state: {addresses: {billing}}}} = getState();

    // Not making request if billing address is same as previous one but allowing it if they are the same
    // but the previousAddress is the same as the default one
    if (
        compareAddresses(billing, previousBilling) &&
        !compareAddresses(previousBilling, defaultAddressState)
    ) {
        dispatch(actionSetAppStateValid('billingAddress', true));
        return;
    }

    const _billing = {...billing};
    delete _billing.id;

    const response: IApiReturnObject = await setBillingAddress(_billing, API_RETRY);
    handleErrorIfNeeded(response, dispatch, getState, Constants.BILLING);
    dispatch(setBillingAddressAsValid);
}
