import {Dispatch} from 'redux';
import {IApiReturnObject, validateDiscount as validateDiscountLib} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {IOrderInitialization} from 'src/types';
import {API_RETRY} from 'src/constants';


export function validateDiscount(code: string, handleError = true) {
    return async function validateDiscountThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<IApiReturnObject> {
        const response = await validateDiscountLib(code, API_RETRY);
        if(handleError){
            handleErrorIfNeeded(response, dispatch, getState);
        }
        return response;
    };
}
