import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IApiReturnObject,
    getBillingAddress,
    setBillingAddress,
    updateBillingAddress,
    IAddress
} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';
import {Constants, defaultAddressState} from 'src/constants';
import { actionSetAppStateValid } from 'src/action';
import { setBillingAddressAsValid } from 'src/library';

export async function postBillingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    dispatch(actionSetAppStateValid('billingAddress', false));
    const previousBilling: IAddress = getBillingAddress();
    const {data: {application_state: {addresses: {billing}}}} = getState();

    if (isObjectEquals(previousBilling, defaultAddressState) ||  (previousBilling && billing && previousBilling.id !== billing.id)) {
        const response: IApiReturnObject = await setBillingAddress(billing);
        handleErrorIfNeeded(response, dispatch, getState, Constants.BILLING);
        dispatch(setBillingAddressAsValid);

    } else if (!isObjectEquals(previousBilling, billing)) {
        const response: IApiReturnObject = await updateBillingAddress(billing);
        handleErrorIfNeeded(response, dispatch, getState, Constants.BILLING);
        dispatch(setBillingAddressAsValid);
    }
}
