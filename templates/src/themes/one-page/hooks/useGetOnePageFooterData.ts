import {IFooterProps} from 'src/types';
import {getTerm, getTotalsFromState, callProcessOrder} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetIsLoading} from 'src/hooks';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';

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

    return {backLinkOnClick, backLinkText, nextButtonOnClick, nextButtonText, nextButtonLoading};
}
