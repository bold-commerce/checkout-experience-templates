import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    addDiscount,
    IAddDiscountResponse,
    IApiReturnObject,
    IApiSuccessResponse
} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getSummaryStateFromLib} from 'src/library';
import {
    actionAddDiscount,
    actionRemoveErrorByField,
    actionRemoveErrorByTypeAndCode,
    actionSetLoader,
    actionUpdateDiscountCodeText
} from 'src/action';
import {errorFields, errorTypes} from 'src/constants';

export function postDiscounts(code: string) {
    return async function postDiscountsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {

        const response: IApiReturnObject = await addDiscount(code);
        handleErrorIfNeeded(response, dispatch, getState);

        if(response.success) {
            const result = response.response as IApiSuccessResponse;
            const {discount} = result.data as IAddDiscountResponse;
            if(discount) {
                await dispatch(getSummaryStateFromLib);
                dispatch(actionAddDiscount(discount.code, discount.value, discount.text));
                dispatch(actionUpdateDiscountCodeText(''));
                dispatch(actionRemoveErrorByField(errorFields.discounts));
                dispatch(actionRemoveErrorByTypeAndCode(errorTypes.discount_code_validation, '02'));
            }
        }

        dispatch(actionSetLoader('discountButton', false));
    };
}
