import {Dispatch} from 'redux';
import {
    IApiReturnObject,
    addPayment as addPaymentLib,
    IAddPaymentRequest
} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {IOrderInitialization} from 'src/types';
import {API_RETRY} from 'src/constants';


export function addPayment(payment: IAddPaymentRequest, handleError = true) {
    return async function addPaymentThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<IApiReturnObject> {
        const response = await addPaymentLib(payment, API_RETRY);
        if(handleError){
            handleErrorIfNeeded(response, dispatch, getState);
        }
        return response;
    };
}
