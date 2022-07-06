import {useCallback} from 'react';
import {
    useGetLoaderScreenVariable,
    useGetDiscounts,
    useGetErrorByField,
    useGetAppSettingData,
    useGetCustomerInfoDataByField,
    useGetIsLoading
} from 'src/hooks';
import {useDispatch} from 'react-redux';
import {actionRemoveErrorByField, actionRemoveErrorByType, actionSetLoaderAndDisableButton, actionUpdateDiscountCodeText} from 'src/action';
import {postDiscounts, validateEmailAddress} from 'src/library';
import {ISummaryDiscountCode} from 'src/types';
import {getTerm} from 'src/utils';
import {Constants, errorFields, errorTypes} from 'src/constants';

export function useSummaryDiscountCode(): ISummaryDiscountCode {
    const discounts = useGetDiscounts();
    const emailAddress = useGetCustomerInfoDataByField('email_address');
    const discountCodeText = useGetAppSettingData('discountText');
    const discountError =  useGetErrorByField(errorFields.discounts, '' , errorTypes.discount_code_validation);
    const buttonLoading = useGetLoaderScreenVariable('discountButton');
    const isLoading = useGetIsLoading();
    const buttonDisabled = discountCodeText === '' || buttonLoading || isLoading;
    const discountCodeInputText = getTerm('discount_code', Constants.SUMMARY_INFO);
    const dispatch = useDispatch();

    const addDiscount = useCallback(async (event) => {
        if(buttonDisabled) {
            event.preventDefault();
            return;
        } 
        
        dispatch(actionSetLoaderAndDisableButton('discountButton', true));

        if(emailAddress === ''){
            await dispatch(postDiscounts(discountCodeText));
        } else {
            await dispatch(validateEmailAddress).then(async () => {
                await dispatch(postDiscounts(discountCodeText));
            });
        }

    }, [discountCodeText, emailAddress]);

    const updateNewDiscountCode = useCallback((event) => {
        dispatch(actionRemoveErrorByType(errorTypes.discount_code_validation));
        dispatch(actionRemoveErrorByField('discounts'));
        dispatch(actionUpdateDiscountCodeText(event.target.value));
    }, [discountCodeText]);

    return {discounts, discountError, buttonLoading, buttonDisabled, addDiscount, updateNewDiscountCode, discountCodeText, discountCodeInputText};
}
