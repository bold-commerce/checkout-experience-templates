import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import { Constants, defaultAddressState } from 'src/constants';
import { actionUpdateAddress, actionUpdateBillingType, actionUpdateBillingTypeInSettings } from 'src/action';
import { validateBillingAddress, validateShippingAddress } from '.';
import { isObjectEquals } from 'src/utils';
import { setShippingAddressAsValid } from './setShippingAddressAsValid';
import { setBillingAddressAsValid } from './setBillingAddressAsValid';

export async function setDefaultAddresses(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const shippingAddress = getState().data.application_state.addresses.shipping;
    const billingAddress = getState().data.application_state.addresses.billing;

    const savedAddresses = getState().data.application_state.customer.saved_addresses;

    //if shipping address already set, we're resuming an order, shipping address is valid
    if (!isObjectEquals(shippingAddress, defaultAddressState)) {
        dispatch(setShippingAddressAsValid);
    } 
    //if billing address already set, we're resuming an order, billing address is valid
    if (!isObjectEquals(billingAddress, defaultAddressState)) {
        dispatch(setBillingAddressAsValid);
    }

    if(isObjectEquals(shippingAddress, defaultAddressState) && savedAddresses.length > 0) {
        dispatch(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));
        await dispatch(validateShippingAddress);

        dispatch(actionUpdateBillingTypeInSettings(Constants.SHIPPING_SAME));
        dispatch(actionUpdateBillingType(Constants.SHIPPING_SAME, savedAddresses[0]));
        await dispatch(validateBillingAddress);
    }
}
