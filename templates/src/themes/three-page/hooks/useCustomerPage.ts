import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useGetButtonDisableVariable, useGetIsLoading, useGetIsOrderProcessed} from 'src/hooks';
import {callCustomerPageApi} from 'src/library';
import {useHistory} from 'react-router';
import {Constants} from 'src/constants';
import {IUseCustomerPageProp} from 'src/types';
import {getCheckoutUrl, getTerm} from 'src/utils';
import {sendEvents} from 'src/analytics';

export function useCustomerPage(): IUseCustomerPageProp {
    const dispatch = useDispatch();
    const history = useHistory();
    const nextButtonLoading = useGetIsLoading();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl('/thank_you'));
    }
    const nextButtonDisable = useGetButtonDisableVariable('customerPageButton');
    const backLinkText = `< ${getTerm('return_to_cart', Constants.CUSTOMER_INFO)}`;
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = window.returnUrl;
    } , [window.returnUrl]);
    const nextButtonText = getTerm('cont_to_shipping', Constants.SHIPPING_INFO);
    const active = 1;
    const nextButtonOnClick = useCallback(() => {
        sendEvents('Checkout', 'Clicked continue to shipping lines button');
        dispatch(callCustomerPageApi(history));
    } , []);
    window.history.replaceState(null, '', getCheckoutUrl('/resume'));

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading};
}
