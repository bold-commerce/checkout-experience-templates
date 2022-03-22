import {IFooterProps} from 'src/types';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetIsLoading} from 'src/hooks';
import {useCallback} from 'react';

export function useGetOnePageFooterData(): IFooterProps{
    const backLinkText = `< ${getTerm('return_to_cart', Constants.CUSTOMER_INFO)}`;
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = window.returnUrl;
    }, [window.returnUrl]);
    const nextButtonOnClick = useCallback(() => {
        //TODO Add complete order button listener
    }, []);

    return {backLinkOnClick, backLinkText, nextButtonOnClick, nextButtonText, nextButtonLoading};
}
