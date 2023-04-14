import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {Constants, defaultAddressState} from 'src/constants';
import {actionUpdateAddress, actionUpdateBillingType, actionUpdateBillingTypeInSettings} from 'src/action';
import {validateBillingAddress, validateShippingAddress} from '.';
import {isObjectEquals} from 'src/utils';

export async function setDefaultAddresses(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const shippingAddress = getState().data.application_state.addresses.shipping;
    const savedAddresses = getState().data.application_state.customer.saved_addresses;

    if(isObjectEquals(shippingAddress, defaultAddressState) && savedAddresses.length > 0) {
        dispatch(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));

        dispatch(actionUpdateBillingTypeInSettings(Constants.SHIPPING_SAME));
        dispatch(actionUpdateBillingType(Constants.SHIPPING_SAME, savedAddresses[0]));
    }

    await dispatch(validateShippingAddress);
    await dispatch(validateBillingAddress);
}
