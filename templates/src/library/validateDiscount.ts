import {Dispatch} from 'redux';
import {IApiReturnObject, validateDiscount as validateDiscountLib} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {IOrderInitialization} from 'src/types';


export function validateDiscount(code: string, handleError = true) {
    return async function validateDiscountThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<IApiReturnObject> {
        const response = await validateDiscountLib(code);
        if(handleError){
            handleErrorIfNeeded(response, dispatch, getState);
        }
        return response;
    };
}
