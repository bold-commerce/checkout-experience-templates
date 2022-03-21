import {getCheckoutUrl, getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useCallback} from 'react';
import {IUseCustomerPageProp} from 'src/types';
import {useDispatch} from 'react-redux';
import {useGetButtonDisableVariable, useGetIsLoading} from 'src/hooks';
import {useHistory} from 'react-router';
import {callShippingPageApi} from 'src/library';
import {sendEvents} from 'src/analytics';

export function useShippingPage(): IUseCustomerPageProp{
    const dispatch = useDispatch();
    const nextButtonDisable = useGetButtonDisableVariable('shippingPageButton');
    const nextButtonLoading = useGetIsLoading();
    const history = useHistory();
    const backLinkText = `< ${getTerm('footer_shipping_cust_info', Constants.SHIPPING_METHOD_INFO)}`;
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        history.replace(getCheckoutUrl(''));
    } , [history]);
    const nextButtonText = getTerm('footer_shipping_continue', Constants.SHIPPING_METHOD_INFO);
    const active = 2;
    const nextButtonOnClick = useCallback(() => {
        sendEvents('Checkout', 'Clicked continue to payment button');
        dispatch(callShippingPageApi(history));
    } , []);

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading};
}
