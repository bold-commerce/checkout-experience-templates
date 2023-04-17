import {useCallback} from 'react';

import {Constants} from 'src/constants';
import {IUseSessionExpired} from 'src/types';
import {getErrorTerm, getReturnToCartTermAndLink, getTerm} from 'src/utils';

export function useGetSessionExpired(): IUseSessionExpired {
    const {link} = getReturnToCartTermAndLink();
    const returnUrl = useCallback(() => {
        window.location.href = link;
    }, [link]);
    const terms = {
        returnToStore: getTerm('return_to_store', Constants.CUSTOMER_INFO, undefined, 'Return to store'),
        sessionExpiredHeader: getErrorTerm('session_expired', Constants.GENERIC_ERROR_INFO, undefined, 'Your checkout session expired'),
        sessionExpiredBody: getErrorTerm('return_to_store_and_checkout', Constants.GENERIC_ERROR_INFO, undefined, 'Return to your store and check out again')
    };

    return {
        returnUrl,
        terms
    };
}
