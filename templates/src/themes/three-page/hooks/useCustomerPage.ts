import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useGetAppSettingData, useGetButtonDisableVariable, useGetCurrencyInformation, useGetIsLoading, useGetIsOrderProcessed, useGetLineItems, useGetOrderTotal} from 'src/hooks';
import {callCustomerPageApi, initializeExpressPay} from 'src/library';
import {useHistory} from 'react-router';
import {Constants} from 'src/constants';
import {IUseCustomerPageProp} from 'src/types';
import {getCheckoutUrl, getReturnToCartTermAndLink, getTerm} from 'src/utils';
import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';

export function useCustomerPage(): IUseCustomerPageProp {
    const dispatch = useDispatch();
    const history = useHistory();
    const nextButtonLoading = useGetIsLoading();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }
    const nextButtonDisable = useGetButtonDisableVariable('customerPageButton');
    const {term, link} = getReturnToCartTermAndLink();
    const backLinkText = getTerm(term, Constants.CUSTOMER_INFO);
    const language = useGetAppSettingData('languageIso') as string;
    const title = getTerm('customer_info_title', Constants.GLOBAL_INFO, undefined , 'Checkout form, customer information');
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    } , [window.returnUrl]);
    const nextButtonText = getTerm('cont_to_shipping', Constants.SHIPPING_INFO);
    const active = 1;
    const nextButtonOnClick = useCallback(() => {
        sendEvents('Clicked continue to shipping lines button', {'category': 'Checkout'});

        dispatch(actionClearErrors());
        dispatch(callCustomerPageApi(history));
    } , []);
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    const items = useGetLineItems();
    const value = useGetOrderTotal();
    const {currency} = useGetCurrencyInformation();

    useEffect( () => {
        if (!isOrderCompleted) {
            sendEvents('begin_checkout', {currency, value, items});
            dispatch(initializeExpressPay(history));
        }
    }, []);

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading, language, title};
}
