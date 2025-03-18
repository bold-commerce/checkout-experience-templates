import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    batchRequest,
    IBatchableRequest
} from '@boldcommerce/checkout-frontend-library';
import {
    getPayloadForPostBillingAddress,
    getPayloadForPostShippingAddress,
    getPayloadForGetShippingLines,
    getPayloadForGenerateTaxes,
    validateBatchResponse,
} from 'src/library';
import {actionSetAppStateValid, actionSetButtonDisable, actionSetLoader} from 'src/action';

export function batchRequestOnePage(batchPostShippingAddress: boolean, batchPostBillingAddress: boolean, digitalProductOnly: boolean) {
    return async function batchRequestOnePageThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const batch : Array<IBatchableRequest> = [];
        let hasShippingRequest = false;

        //post shipping address
        const postShippingPayload = getPayloadForPostShippingAddress(dispatch, getState);
        if (batchPostShippingAddress && postShippingPayload) {
            batch.push(postShippingPayload);
            hasShippingRequest = true;
        }

        if (hasShippingRequest) {
            dispatch(actionSetLoader('shippingLines', true));
        }

        //post billing address
        const postBillingPayload = getPayloadForPostBillingAddress(dispatch, getState);
        if (batchPostBillingAddress && postBillingPayload) {
            batch.push(postBillingPayload);
        }

        //get shipping lines and set default shipping line
        const getShippingLinesPayload = getPayloadForGetShippingLines(hasShippingRequest, getState);
        if (getShippingLinesPayload) {
            batch.push(getShippingLinesPayload);
        }

        //generate taxes
        const generateTaxesPayload = getPayloadForGenerateTaxes(hasShippingRequest);
        if (generateTaxesPayload) {
            batch.push(generateTaxesPayload);
        }

        if (batch.length > 0) {
            await batchRequest(batch).then( async (response) => {
                await (validateBatchResponse(dispatch, getState, response)).then(() => {
                    if(hasShippingRequest){
                        dispatch(actionSetAppStateValid('taxesGenerated', true));
                    }
                    if (!digitalProductOnly) {
                        dispatch(actionSetButtonDisable('shippingPageButton', false));
                        dispatch(actionSetAppStateValid('shippingLine', true));
                        dispatch(actionSetLoader('shippingLines', false));
                    }
                });
            });
        }
    };
}
