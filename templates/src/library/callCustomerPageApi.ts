import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    validateBillingAddress,
    validateShippingAddress,
    validateEmailAddress,
    checkErrorAndProceedToNextPage,
    updateCustomer
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {Constants} from 'src/constants';

export function callCustomerPageApi(history: HistoryLocationState) {
    return async function callCustomerPageApiThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        dispatch(actionSetLoaderAndDisableButton('customerPageButton', true));
        const platformId = state.data.application_state.customer.platform_id;
        const isUserLogin = (platformId != null && +platformId > 0);

        const validateAddresses = async () => {
            dispatch(validateShippingAddress).then(() => {
                dispatch(validateBillingAddress).then(() => {
                    dispatch(checkErrorAndProceedToNextPage(Constants.SHIPPING_ROUTE, 'customerPageButton', history, false));
                });
            });
        };

        if (isUserLogin) {
            await dispatch(updateCustomer).then(() => {
                dispatch(validateAddresses);
            });
        } else {
            await dispatch(validateEmailAddress).then(() => {
                dispatch(validateAddresses);
            });
        }
    };
}
