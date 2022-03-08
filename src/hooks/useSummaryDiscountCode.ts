import {useCallback} from 'react';
import {useGetLoaderScreenVariable, useGetDiscounts, useGetErrorByField, useGetAppSettingData} from 'src/hooks';
import {useDispatch} from 'react-redux';
import {actionRemoveErrorByField, actionSetLoaderAndDisableButton, actionUpdateDiscountCodeText} from 'src/action';
import {postDiscounts} from 'src/library';
import {ISummaryDiscountCode} from 'src/types';
import {getTerm} from 'src/utils';
import {errorFields, errorTypes} from 'src/constants';

export function useSummaryDiscountCode(): ISummaryDiscountCode {
    const discounts = useGetDiscounts();
    const discountCodeText = useGetAppSettingData('discountText');
    const discountError =  useGetErrorByField(errorFields.discounts, '' , errorTypes.discount_code_validation);
    const buttonLoading = useGetLoaderScreenVariable('discountButton');
    const discountCodeInputText = getTerm('discount_code', 'summary');
    const dispatch = useDispatch();

    const addDiscount = useCallback(() => {
        dispatch(actionSetLoaderAndDisableButton('discountButton', true));
        dispatch(postDiscounts(discountCodeText));
    }, [discountCodeText]);

    const updateNewDiscountCode = useCallback((event) => {
        dispatch(actionRemoveErrorByField('discounts'));
        dispatch(actionUpdateDiscountCodeText(event.target.value));
    }, [discountCodeText]);

    return {discounts, discountError, buttonLoading, addDiscount, updateNewDiscountCode, discountCodeText, discountCodeInputText};
}
