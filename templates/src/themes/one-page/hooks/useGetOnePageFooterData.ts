import {IFooterProps} from 'src/types';
import {getTerm, getTotalsFromState, callProcessOrder} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetIsLoading} from 'src/hooks';
import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {initializeExpressPay} from 'src/library';

export function useGetOnePageFooterData(): IFooterProps{
    const dispatch = useDispatch();
    const history = useHistory();
    const totals = getTotalsFromState();
    const backLinkText = getTerm('return_to_cart', Constants.CUSTOMER_INFO);
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = window.returnUrl;
    }, [window.returnUrl]);
    const nextButtonOnClick = useCallback(() => {
        callProcessOrder(dispatch, totals, history);
    }, [totals]);

    useEffect( () => {
        dispatch(initializeExpressPay(history));
    }, []);

    return {backLinkOnClick, backLinkText, nextButtonOnClick, nextButtonText, nextButtonLoading};
}
