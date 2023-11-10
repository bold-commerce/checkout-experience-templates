import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    validateBillingAddress,
    validateShippingAddress,
    validateEmailAddress,
    updateCustomer,
    returnToPageOnError
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';

export function validateCustomerOnLoad(history: HistoryLocationState) {
    return async function validateCustomerOnLoadThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        dispatch(actionSetLoaderAndDisableButton('customerPageButton', true));
        const platformId = state.data.application_state.customer.platform_id;
        const isUserLogin = (platformId != null && +platformId > 0);

        const validateAddresses = async () => {
            dispatch(validateShippingAddress).then(() => {
                dispatch(validateBillingAddress).then(() => {
                    dispatch(returnToPageOnError('', 'customerPageButton', history));
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
