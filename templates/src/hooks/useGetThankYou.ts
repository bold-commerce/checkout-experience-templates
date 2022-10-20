import {useCallback} from 'react';

import {Constants} from 'src/constants';
import {useGetCustomerInfoData, useGetShopUrlFromShopAlias, useGetValidVariable} from 'src/hooks';
import {IUseGetThankYou} from 'src/types';
import {getTerm, getShopDomain} from 'src/utils';

export function useGetThankYou(): IUseGetThankYou {
    const shopDomain = getShopDomain();
    const shopURL = useGetShopUrlFromShopAlias(shopDomain);
    const returnUrl = useCallback(() => {
        window.location.href = shopURL;
    }, [shopURL]);
    const customerInformation = useGetCustomerInfoData();
    const terms = {
        thankYou: getTerm('thank_you', Constants.CONFIRMATION_PAGE_INFO),
        orderConfirmed: getTerm('order_confirmed', Constants.CONFIRMATION_PAGE_INFO),
        orderConfirmedText: getTerm('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO),
        keepShopping: getTerm('keep_shopping', Constants.CONFIRMATION_PAGE_INFO),
    };
    const isGeneric = !useGetValidVariable('orderProcessed') || !customerInformation?.first_name;
    const thankYouTitle = `${terms.thankYou}${!isGeneric ? `, ${customerInformation.first_name}!` : '!'}`;

    return {
        returnUrl,
        thankYouTitle,
        terms,
        isGeneric
    };
}
