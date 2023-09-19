import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    apiTypeKeys,
    getBillingAddress,
    IAddress,
    IBatchableRequest
} from '@boldcommerce/checkout-frontend-library';
import {compareAddresses} from 'src/utils';
import {defaultAddressState} from 'src/constants';
import {actionSetAppStateValid} from 'src/action';

export function getPayloadForPostBillingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): IBatchableRequest | null {
    dispatch(actionSetAppStateValid('billingAddress', false));
    const previousBilling: IAddress = getBillingAddress();
    const {data: {application_state: {addresses: {billing}}}} = getState();

    if (compareAddresses(billing, previousBilling) &&
        !compareAddresses(previousBilling, defaultAddressState)
    ) {
        dispatch(actionSetAppStateValid('billingAddress', true));
        return null;
    }

    const _billing = {...billing};
    delete _billing.id;

    return {apiType: apiTypeKeys.setBillingAddress, payload: _billing};
}
