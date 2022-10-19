import {getCheckoutUrl, getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useCallback} from 'react';
import {IUseCustomerPageProp} from 'src/types';
import {useDispatch} from 'react-redux';
import {useGetButtonDisableVariable, useGetIsLoading, useGetIsOrderProcessed} from 'src/hooks';
import {useHistory} from 'react-router';
import {callShippingLinesPageApi} from 'src/library';
import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';

export function useShippingPage(): IUseCustomerPageProp{
    const dispatch = useDispatch();
    const history = useHistory();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }
    const nextButtonDisable = useGetButtonDisableVariable('shippingPageButton');
    const nextButtonLoading = useGetIsLoading();
    const backLinkText = getTerm('footer_shipping_cust_info', Constants.SHIPPING_METHOD_INFO);
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        history.replace(getCheckoutUrl(''));
    } , [history]);
    const nextButtonText = getTerm('footer_shipping_continue', Constants.SHIPPING_METHOD_INFO);
    const active = 2;
    const nextButtonOnClick = useCallback(() => {
        sendEvents('Checkout', 'Clicked continue to payment button');
        dispatch(actionClearErrors());
        dispatch(callShippingLinesPageApi(history));
    } , []);

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading};
}
