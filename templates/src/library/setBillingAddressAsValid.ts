import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionSetAppStateValid} from 'src/action';
import {Constants} from 'src/constants';

export function setBillingAddressAsValid(dispatch: Dispatch, getState: () => IOrderInitialization): void {
    const {errors} = getState();
    const error = errors.find(error => error.address_type === Constants.BILLING);
    if(!error) {
        dispatch(actionSetAppStateValid('billingAddress', true)); 
    }
}
