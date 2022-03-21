import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import { Constants } from 'src/constants';
import { actionUpdateAddress, actionUpdateBillingType, actionUpdateBillingTypeInSettings } from 'src/action';
import { validateBillingAddress, validateShippingAddress } from '.';

export async function setDefaultAddresses(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const savedAddresses = getState().data.application_state.customer.saved_addresses;
    if(savedAddresses.length > 0) {
        dispatch(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));
        await dispatch(validateShippingAddress);

        dispatch(actionUpdateBillingTypeInSettings(Constants.SHIPPING_SAME));
        dispatch(actionUpdateBillingType(Constants.SHIPPING_SAME, savedAddresses[0]));
        await dispatch(validateBillingAddress);
    }
}
