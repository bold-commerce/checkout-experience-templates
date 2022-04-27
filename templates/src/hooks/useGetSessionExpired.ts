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
        returnToCart: getTerm('return_to_cart', Constants.CUSTOMER_INFO),
        sessionExpiredHeader: getErrorTerm('session_expired', Constants.GENERIC_ERROR_INFO),
        sessionExpiredBody: getErrorTerm('return_to_cart_and_checkout', Constants.GENERIC_ERROR_INFO)
    };

    return {
        returnUrl,
        terms
    };
}
