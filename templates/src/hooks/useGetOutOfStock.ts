import {useCallback} from 'react';

import {Constants} from 'src/constants';
import {IUseOutOfStock} from 'src/types';
import {getReturnToCartTermAndLink, getTerm} from 'src/utils';

export function useGetOutOfStock(): IUseOutOfStock {
    const {term, link} = getReturnToCartTermAndLink();
    const returnUrl = useCallback(() => {
        window.location.href = link;
    }, [link]);

    const terms = {
        returnToCart: getTerm(term, Constants.CUSTOMER_INFO),
        returnToProduct: getTerm('buy_now_return_to_product', Constants.CUSTOM),
        outOfStockHeader: getTerm('inventory_issues', Constants.OUT_OF_STOCK_INFO),
        outOfStockBody: getTerm('unavailable_products_message', Constants.OUT_OF_STOCK_INFO)
    };

    return {
        returnUrl,
        terms
    };
}
