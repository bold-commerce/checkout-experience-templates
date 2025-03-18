import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getBillingAddress} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {postAddress, setBillingAddressAsValid, validateAddressFunction} from 'src/library';
import {actionRemoveErrorByAddressType, actionSetAppStateValid, actionUpdateBillingAsShipping} from 'src/action';

export function validateBillingAddress(setDefaultBilling = false, prevBillingType?: string) {
    return async function validateBillingAddressThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const currentState = getState();
        const billingType = currentState.appSetting.billingType;
        const validAddress = currentState.isValid.shippingAddress;
        const shipping = currentState.data.application_state.addresses.shipping;
        const isOnePageTheme = currentState.appSetting.isOnePageTheme;
        dispatch(actionRemoveErrorByAddressType(Constants.BILLING));

        //check if we have stale billingType
        if (!prevBillingType || (prevBillingType === billingType)) {
            if(billingType === Constants.SHIPPING_SAME) {
                await dispatch(actionUpdateBillingAsShipping(shipping));
                if (isOnePageTheme) {
                    dispatch(actionSetAppStateValid('batchPostBillingAddress', true));
                } else {
                    if (validAddress) {
                        await dispatch(postAddress(Constants.BILLING));
                        await dispatch(setBillingAddressAsValid);
                    }
                }
            } else {
                const address = getState().data.application_state.addresses.billing;
                const libraryAddress = getBillingAddress();
                if (!setDefaultBilling) {
                    await dispatch(validateAddressFunction(Constants.BILLING, address, libraryAddress));
                }
            }
        }
    };
}
