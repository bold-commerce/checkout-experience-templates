import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {deleteDiscount, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getSummaryStateFromLib} from 'src/library';
import {actionRemoveDiscount, actionSetLoaderAndDisableButton} from 'src/action';
import {API_RETRY} from 'src/constants';

export function deleteDiscounts(code: string) {
    return async function deleteDiscountsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {

        const response: IApiReturnObject = await deleteDiscount(code, API_RETRY);
        handleErrorIfNeeded(response, dispatch, getState);

        if(response.success) {
            await dispatch(getSummaryStateFromLib);
            dispatch(actionRemoveDiscount(code));
        }

        dispatch(actionSetLoaderAndDisableButton('discountClose' , false));
    };
}
