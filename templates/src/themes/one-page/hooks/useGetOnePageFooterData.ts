import {IFormControlsProps} from 'src/types';
import {getTerm, getTotalsFromState, callProcessOrder, getReturnToCartTermAndLink} from 'src/utils';
import {Constants, LifeInputPageConstants} from 'src/constants';
import {useGetAppSettingData, useGetIsLoading, useGetRequiredLifeFields} from 'src/hooks';
import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {initializeExpressPay} from 'src/library';

export type IUseGetOnePageFooterDataProps = IFormControlsProps & Required<Pick<IFormControlsProps, 'nextButtonOnClick'>>

export function useGetOnePageFooterData(): IUseGetOnePageFooterDataProps {
    const dispatch = useDispatch();
    const history = useHistory();
    const totals = getTotalsFromState();
    const {term, link} = getReturnToCartTermAndLink();
    const language = useGetAppSettingData('languageIso') as string;
    const backLinkText = getTerm(term, Constants.CUSTOMER_INFO);
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const title = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const nextButtonTestDataId = 'footer-complete-order-button';
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    }, [link]);
    const requiredLifeFields = useGetRequiredLifeFields(LifeInputPageConstants.ONE_PAGE);
    const nextButtonOnClick = useCallback(() => {
        callProcessOrder(dispatch, totals, history, requiredLifeFields);
    }, [totals]);

    useEffect( () => {
        dispatch(initializeExpressPay(history));
    }, []);

    return {backLinkOnClick, backLinkText, nextButtonOnClick, nextButtonText, nextButtonLoading, language, title, nextButtonTestDataId};
}
