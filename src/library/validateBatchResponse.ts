import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IApiSubrequestSuccessResponse,
    IApiBatchResponse,
    IApiReturnObject,
} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {handleBatchSuccess} from 'src/library';

export async function validateBatchResponse(dispatch: Dispatch, getState: () => IOrderInitialization, response: IApiReturnObject): Promise<void> {

    if (!response.success) {
        const batchResponse : IApiBatchResponse = response.response as IApiBatchResponse;
        if (batchResponse && batchResponse.data) {
            batchResponse.data.forEach((subrequest) => {
                if (subrequest.status_code !== 200) {
                    let addressType = '';
                    if(subrequest.endpoint.includes('addresses')) {
                        addressType = subrequest.endpoint.replace('/addresses/','');
                    }
                    handleErrorIfNeeded(response, dispatch, getState, addressType);
                } else {
                    handleBatchSuccess(dispatch, getState, subrequest as IApiSubrequestSuccessResponse);
                }
            });
        } else {
            handleErrorIfNeeded(response, dispatch, getState);
        }
    } else {
        const batchResponse : IApiBatchResponse = response.response as IApiBatchResponse;
        batchResponse.data.forEach( (subrequest) => {
            handleBatchSuccess(dispatch, getState, subrequest as IApiSubrequestSuccessResponse);
        });
    }
}
