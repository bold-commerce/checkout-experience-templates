import {useCallback, useEffect, useState} from 'react';
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
import {Constants, errorFields, errorTypes, HIDE_MESSAGE} from 'src/constants';

export function useSummaryDiscountCode(): ISummaryDiscountCode {
    const discounts = useGetDiscounts();
    const emailAddress = useGetCustomerInfoDataByField('email_address');
    const discountCodeText = useGetAppSettingData('discountText') as string;
    const discountError =  useGetErrorByField(errorFields.discounts, '' , errorTypes.discount_code_validation);
    const buttonLoading = useGetLoaderScreenVariable('discountButton');
    const isLoading = useGetIsLoading();
    const dispatch = useDispatch();
    const discountCodeInputText = getTerm('discount_code', Constants.SUMMARY_INFO);
    const applyDiscountCodeButtonTest = getTerm('apply_discount_code_button', Constants.SUMMARY_INFO);
    const ariaLabelText = getTerm('discount_code_successfully_applied', Constants.SUMMARY_INFO);
    const [ariaLabel, setAriaLabel] = useState(applyDiscountCodeButtonTest);
    const [ariaLive, setAriaLive] = useState(Constants.ARIA_LIVE_POLITE);

    const buttonDisabled = discountCodeText === '' || buttonLoading || isLoading;
    useEffect(() => {
        if (Array.isArray(discounts) && discounts.length > 0) {
            setAriaLabel(ariaLabelText);
            setAriaLive(Constants.ARIA_LIVE_ASSERTIVE);
            const clearAriaFields = setTimeout(() => {
                setAriaLabel(applyDiscountCodeButtonTest);
                setAriaLive(Constants.ARIA_LIVE_POLITE);
            }, HIDE_MESSAGE);
            return () => {
                clearTimeout(clearAriaFields);
                setAriaLabel(applyDiscountCodeButtonTest);
                setAriaLive(Constants.ARIA_LIVE_POLITE);
            };
        }
    }, [discounts]);

    const addDiscount = useCallback(async (event) => {
        if(buttonDisabled) {
            event.preventDefault();
            return;
        }

        dispatch(actionSetLoaderAndDisableButton('discountButton', true));

        if(emailAddress === ''){
            await dispatch(postDiscounts(discountCodeText)).then((focusElement: HTMLElement | null) => {
                focusElement && focusElement.focus();
            });
        } else {
            await dispatch(validateEmailAddress).then(async () => {
                await dispatch(postDiscounts(discountCodeText)).then((focusElement: HTMLElement | null) => {
                    focusElement && focusElement.focus();
                });
            });
        }

    }, [discountCodeText, emailAddress]);

    const updateNewDiscountCode = useCallback((event) => {
        dispatch(actionRemoveErrorByType(errorTypes.discount_code_validation));
        dispatch(actionRemoveErrorByField('discounts'));
        dispatch(actionUpdateDiscountCodeText(event.target.value));
    }, [discountCodeText]);

    return {discounts, discountError, buttonLoading, buttonDisabled, addDiscount, updateNewDiscountCode, discountCodeText, discountCodeInputText, ariaLabel, ariaLive};
}
