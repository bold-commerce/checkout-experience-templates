import {useDispatch} from 'react-redux';
import {
    useGetAppSettingData,
    useGetButtonDisableVariable,
    useGetCurrencyInformation,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLineItems,
    useGetSelectShippingLine,
} from 'src/hooks';
import {
    getCheckoutUrl,
    getTerm,
    getTotalsFromState,
    callProcessOrder
} from 'src/utils';
import {Constants} from 'src/constants';
import {useCallback, useEffect} from 'react';
import {useHistory} from 'react-router';
import {IUsePaymentPage} from 'src/types';
import {sendEvents} from 'src/analytics';

export function usePaymentPage(): IUsePaymentPage{
    const history = useHistory();
    const dispatch = useDispatch();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }
    const backLinkText = getTerm('return_to_shipping', Constants.PAYMENT_INFO);
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const language = useGetAppSettingData('languageIso') as string;
    const title = getTerm('payment_method_title', Constants.GLOBAL_INFO, undefined , 'Checkout form, payment method');
    const nextButtonDisable = useGetButtonDisableVariable('paymentPageButton');
    const totals = getTotalsFromState();
    const {currency} = useGetCurrencyInformation();
    const items = useGetLineItems();
    const {description: shipping_tier, amount: value} = useGetSelectShippingLine();

    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        history.replace(getCheckoutUrl(Constants.SHIPPING_ROUTE));
    } , [history]);

    const nextButtonOnClick = useCallback( () => {
        callProcessOrder(dispatch, totals, history);
    },[totals, history]);

    useEffect(() => {
        sendEvents('add_shipping_info', {currency, value, shipping_tier, items});
    }, []);

    return {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, language, title};
}
