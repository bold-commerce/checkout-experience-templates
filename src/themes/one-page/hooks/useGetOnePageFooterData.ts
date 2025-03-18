import {IFormControlsProps} from 'src/types';
import {
    getTerm,
    getTotalsFromState,
    callProcessOrder,
    getReturnToCartTermAndLink,
    callEpsProcessOrder
} from 'src/utils';
import {Constants, LifeInputPageConstants} from 'src/constants';
import {useGetAppSettingData, useGetEpsGateways, useGetIsLoading, useGetLifeFieldsOnPage} from 'src/hooks';
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
    const isGatewayEps = useGetEpsGateways();
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const title = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const nextButtonTestDataId = 'footer-complete-order-button';
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    }, [link]);
    const requiredLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.ONE_PAGE);
    const thankYouPageLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.THANK_YOU_PAGE);
    const nextButtonOnClick = useCallback(() => {
        if(isGatewayEps) {
            dispatch(callEpsProcessOrder(history, totals, requiredLifeFields, thankYouPageLifeFields));
        } else {
            callProcessOrder(dispatch, totals, history, requiredLifeFields, isGatewayEps, thankYouPageLifeFields);
        }
    }, [totals]);

    useEffect( () => {
        dispatch(initializeExpressPay(history));
    }, [isGatewayEps]);

    return {backLinkOnClick, backLinkText, nextButtonOnClick, nextButtonText, nextButtonLoading, language, title, nextButtonTestDataId};
}
