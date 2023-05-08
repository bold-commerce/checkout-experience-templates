import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    addDiscount,
    IAddDiscountResponse,
    IApiReturnObject,
    IApiSuccessResponse
} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getSummaryStateFromLib} from 'src/library';
import {
    actionAddDiscount,
    actionRemoveErrorByField,
    actionRemoveErrorByTypeAndCode,
    actionSetLoader,
    actionUpdateDiscountCodeText
} from 'src/action';
import {API_RETRY, errorFields, errorTypes} from 'src/constants';
import {sendEvents} from 'src/analytics';

export function postDiscounts(code: string) {
    return async function postDiscountsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<HTMLElement | null> {
        const response: IApiReturnObject = await addDiscount(code, API_RETRY);
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
                sendEvents('select_promotion', {'promotion_id': discount.code, 'promotion_name': discount.text});
            }
        }

        dispatch(actionSetLoader('discountButton', false));
        return response.success ?
            document.getElementById('add-discount-code-button') :
            document.getElementById('add-discount-code-field-input');
    };
}
