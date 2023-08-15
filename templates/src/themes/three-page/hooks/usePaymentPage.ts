import {useDispatch} from 'react-redux';
import {
    useGetAppSettingData,
    useGetButtonDisableVariable,
    useGetCurrencyInformation,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLineItems,
    useGetRequiredLifeFields,
    useGetRequiresShipping,
    useGetSelectShippingLine,
} from 'src/hooks';
import {
    getCheckoutUrl,
    getTerm,
    getTotalsFromState,
    callProcessOrder
} from 'src/utils';
import {Constants, LifeInputPageConstants} from 'src/constants';
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

    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const language = useGetAppSettingData('languageIso') as string;
    const title = getTerm('payment_method_title', Constants.GLOBAL_INFO, undefined , 'Checkout form, payment method');
    const nextButtonDisable = useGetButtonDisableVariable('paymentPageButton');
    const totals = getTotalsFromState();
    const {currency} = useGetCurrencyInformation();
    const items = useGetLineItems();
    const {description: shipping_tier, amount: value} = useGetSelectShippingLine();

    const requiresShipping = useGetRequiresShipping();
    const backLinkText = requiresShipping ? getTerm('return_to_shipping', Constants.PAYMENT_INFO) : getTerm('footer_shipping_cust_info', Constants.SHIPPING_METHOD_INFO);
    const backLinkOnClick =useCallback((event) => {
        event.preventDefault();
        if (requiresShipping) {
            history.replace(getCheckoutUrl(Constants.SHIPPING_ROUTE));
        } else {
            history.replace(getCheckoutUrl(''));
        }
    } , [history]);

    const requiredLifeFields = useGetRequiredLifeFields(LifeInputPageConstants.PAYMENT_THREE_PAGE);
    const nextButtonOnClick = useCallback( () => {
        callProcessOrder(dispatch, totals, history, requiredLifeFields);
    },[totals, history]);

    useEffect(() => {
        sendEvents('add_shipping_info', {currency, value, shipping_tier, items});
    }, []);

    return {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, language, title};
}
