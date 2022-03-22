import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import { Constants } from 'src/constants';
import { actionUpdateAddress } from 'src/action';
import { validateShippingAddress } from '.';

export function setDefaultShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): void {
    const savedAddresses = getState().data.application_state.customer.saved_addresses;
    if(savedAddresses.length > 0) {
        dispatch(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));
        dispatch(validateShippingAddress);
    }
}
