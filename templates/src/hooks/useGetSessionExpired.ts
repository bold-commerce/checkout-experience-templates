import {useCallback} from 'react';

import {Constants, NeuroIdConstants} from 'src/constants';
import {IUseSessionExpired} from 'src/types';
import {getErrorTerm, getNeuroIdPageName, getTerm, neuroIdSubmit} from 'src/utils';

export function useGetSessionExpired(): IUseSessionExpired {
    const returnUrl = useCallback(() =>
    {
        neuroIdSubmit(getNeuroIdPageName(NeuroIdConstants.sessionExpiredPage));
        window.location.href = window.returnUrl;
    }, [window.returnUrl]);
    const terms = {
        returnToCart: getTerm('return_to_cart', Constants.CUSTOMER_INFO, undefined, 'Return to cart'),
        sessionExpiredHeader: getErrorTerm('session_expired', Constants.GENERIC_ERROR_INFO, undefined, 'Your checkout session expired'),
        sessionExpiredBody: getErrorTerm('return_to_cart_and_checkout', Constants.GENERIC_ERROR_INFO, undefined, 'Return to your cart and check out again')
    };

    return {
        returnUrl,
        terms
    };
}
