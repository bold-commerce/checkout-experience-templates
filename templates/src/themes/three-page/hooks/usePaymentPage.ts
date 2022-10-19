import {useDispatch} from 'react-redux';
import {
    useGetButtonDisableVariable,
    useGetIsLoading,
    useGetIsOrderProcessed,
} from 'src/hooks';
import {
    getCheckoutUrl,
    getTerm,
    getTotalsFromState,
    callProcessOrder
} from 'src/utils';
import {Constants} from 'src/constants';
import {useCallback} from 'react';
import {useHistory} from 'react-router';
import {IUsePaymentPage} from 'src/types';

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
    const nextButtonDisable = useGetButtonDisableVariable('paymentPageButton');
    const totals = getTotalsFromState();

    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        history.replace(getCheckoutUrl(Constants.SHIPPING_ROUTE));
    } , [history]);

    const nextButtonOnClick = useCallback( () => {
        callProcessOrder(dispatch, totals, history);
    },[totals, history]);

    return {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable};
}
