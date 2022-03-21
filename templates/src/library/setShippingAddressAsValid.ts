import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionSetAppStateValid} from 'src/action';
import {Constants} from 'src/constants';

export function setShippingAddressAsValid(dispatch: Dispatch, getState: () => IOrderInitialization): void {
    const {errors} = getState();
    const error = errors.find(error => error.address_type === Constants.SHIPPING);
    if(!error) {
        dispatch(actionSetAppStateValid('updatedShippingAddress', true));
        dispatch(actionSetAppStateValid('shippingAddress', true));
    }
}
