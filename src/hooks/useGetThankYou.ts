import {useCallback} from 'react';

import {Constants} from 'src/constants';
import {useGetCustomerInfoData} from 'src/hooks';
import {IUseGetThankYou} from 'src/types';
import {getTerm} from 'src/utils';

export function useGetThankYou(): IUseGetThankYou {
    const returnUrl = useCallback(() => { window.location.href = window.returnUrl; } , [window.returnUrl]);
    const customerInformation = useGetCustomerInfoData();
    const terms = {
        thankYou: getTerm('thank_you', Constants.CONFIRMATION_PAGE_INFO),
        orderConfirmed: getTerm('order_confirmed', Constants.CONFIRMATION_PAGE_INFO),
        orderConfirmedText: getTerm('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO),
        keepShopping: getTerm('keep_shopping', Constants.CONFIRMATION_PAGE_INFO),
    };
    const thankYouTitle = `${terms.thankYou}${customerInformation?.first_name ? `, ${customerInformation.first_name}!` : '!'}`;

    return {
        returnUrl,
        thankYouTitle,
        terms
    };
}
