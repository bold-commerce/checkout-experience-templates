import {useCallback} from 'react';

import {Constants} from 'src/constants';
import {IUseOutOfStock} from 'src/types';
import {getTerm} from 'src/utils';

export function useGetOutOfStock(): IUseOutOfStock {
    const returnUrl = useCallback(() => { window.location.href = window.returnUrl; } , [window.returnUrl]);
    const terms = {
        returnToCart: getTerm('return_to_cart', Constants.CUSTOMER_INFO),
        outOfStockHeader: getTerm('inventory_issues', Constants.OUT_OF_STOCK_INFO),
        outOfStockBody: getTerm('unavailable_products_message', Constants.OUT_OF_STOCK_INFO)
    };

    return {
        returnUrl,
        terms
    };
}
