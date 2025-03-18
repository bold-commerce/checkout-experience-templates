import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    validateBillingAddress,
    validateShippingAddress,
    validateEmailAddress,
    updateCustomer,
    returnToPageOnError,
    validateShippingLine,
    generateTaxes
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetAppStateValid, actionSetLoaderAndDisableButton} from 'src/action';
import {Constants} from 'src/constants';

export function validateCustomerAndShippingOnLoad(history: HistoryLocationState) {
    return async function validateCustomerAndShippingOnLoadThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        dispatch(actionSetLoaderAndDisableButton('customerPageButton', true));
        const platformId = state.data.application_state.customer.platform_id;
        const isUserLogin = (platformId != null && +platformId > 0);
        const requiresShipping = state.data.initial_data.requires_shipping;

        const validateAddressesAndShipping = async () => {
            dispatch(validateShippingAddress).then(async () => {
                dispatch(validateBillingAddress()).then(async () => {
                    dispatch(returnToPageOnError('', 'customerPageButton', history)).then(() => {
                        const {errors} = getState();
                        if (!errors || errors.length === 0) {
                            if (requiresShipping) {
                                dispatch(validateShippingLine).then(async () => {
                                    dispatch(returnToPageOnError(Constants.SHIPPING_ROUTE, 'shippingPageButton', history));
                                });
                            } else {
                                dispatch(generateTaxes);
                                dispatch(actionSetAppStateValid('shippingLine', true));
                            }
                        }
                    });
                });
            });
        };

        if (isUserLogin) {
            await dispatch(updateCustomer).then(async () => {
                dispatch(validateAddressesAndShipping);
            });
        } else {
            await dispatch(validateEmailAddress).then(async () => {
                dispatch(validateAddressesAndShipping);
            });
        }
    };
}
