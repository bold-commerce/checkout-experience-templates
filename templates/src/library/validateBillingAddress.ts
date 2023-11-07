import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    getBillingAddress,
} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {postAddress, validateAddressFunction} from 'src/library';
import {actionRemoveErrorByAddressType, actionUpdateBillingAsShipping} from 'src/action';
import {setBillingAddressAsValid} from './setBillingAddressAsValid';

export function validateBillingAddress(defaultBillingType: boolean) {
    return async function validateBillingAddressThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const currentState = getState();
        const billingType = defaultBillingType ? Constants.SHIPPING_SAME : currentState.appSetting.billingType;
        const validAddress = currentState.isValid.shippingAddress;
        const shipping = currentState.data.application_state.addresses.shipping;
        dispatch(actionRemoveErrorByAddressType(Constants.BILLING));

        if(billingType === Constants.SHIPPING_SAME) {
            await dispatch(actionUpdateBillingAsShipping(shipping));
            if (validAddress) {
                await dispatch(postAddress(Constants.BILLING));
                await dispatch(setBillingAddressAsValid);
            }
        } else {
            const address = getState().data.application_state.addresses.billing;
            const libraryAddress = getBillingAddress();
            await dispatch(validateAddressFunction(Constants.BILLING, address, libraryAddress));
        }
    };
}
