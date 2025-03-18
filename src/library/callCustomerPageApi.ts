import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    validateBillingAddressV2,
    validateShippingAddressV2,
    validateEmailAddressV2,
    checkErrorAndProceedToNextPage,
    getPayloadForUpdateCustomer,
    validateBatchResponse
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {Constants} from 'src/constants';
import {IBatchableRequest} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {batchRequest} from '@boldcommerce/checkout-frontend-library';

export function callCustomerPageApi(history: HistoryLocationState) {
    return async function callCustomerPageApiThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        const batch : Array<IBatchableRequest> = [];
        dispatch(actionSetLoaderAndDisableButton('customerPageButton', true));
        const platformId = state.data.application_state.customer.platform_id;
        const isUserLogin = (platformId != null && +platformId > 0);
        const requiresShipping = state.data.initial_data.requires_shipping;

        const validateAddresses = async () => {
            batch.push(...dispatch(validateShippingAddressV2));
            batch.push(...dispatch(validateBillingAddressV2));
        };

        if (isUserLogin) {
            const updateCustomerBatch = dispatch(getPayloadForUpdateCustomer);
            if (updateCustomerBatch) {
                batch.push(updateCustomerBatch);
            }
            await dispatch(validateAddresses);
        } else {
            batch.push(...dispatch(validateEmailAddressV2));
            await dispatch(validateAddresses);
        }
        await batchRequest(batch).then( async (response) => {
            await (validateBatchResponse(dispatch, getState, response)).then( () => {
                if (requiresShipping) {
                    dispatch(checkErrorAndProceedToNextPage(Constants.SHIPPING_ROUTE, 'customerPageButton', history, false));
                } else {
                    dispatch(checkErrorAndProceedToNextPage(Constants.PAYMENT_ROUTE, 'customerPageButton', history, false));
                }
            });
        });
    };
}
