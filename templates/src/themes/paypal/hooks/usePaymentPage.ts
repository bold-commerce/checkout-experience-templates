import {useGetIsOrderProcessed,} from 'src/hooks';
import {getCheckoutUrl, getTerm, getReturnToCartTermAndLink} from 'src/utils';
import {Constants} from 'src/constants';
import {useCallback} from 'react';
import {useHistory} from 'react-router';
import {IFormControlsProps} from 'src/types';

export function usePaymentPage(): IFormControlsProps {
    const history = useHistory();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }
    const nextButtonText = '';
    const title = getTerm('payment_method_title', Constants.GLOBAL_INFO, undefined , 'Checkout form, payment method');

    const {term, link} = getReturnToCartTermAndLink();
    const backLinkText = getTerm(term, Constants.CUSTOMER_INFO);
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    } , [link]);

    return {title, nextButtonText, backLinkText, backLinkOnClick};
}
