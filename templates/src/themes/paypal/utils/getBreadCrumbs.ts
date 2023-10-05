import {IBreadcrumb, IBreadcrumbs} from 'src/types';
import {
    getTerm,
    getBreadcrumbStatus,
    getCheckoutUrl,
    getReturnToCartTermAndLink,
    isBoldPlatform
} from 'src/utils';
import {Constants} from 'src/constants';
import {BrowserHistory} from 'history';

export function getBreadcrumbs(history: BrowserHistory, active: number): IBreadcrumbs {
    let index = 0;
    let cartTerm = isBoldPlatform() ? 'store': 'cart';
    // TODO PXP-682
    if (window.shopAlias == 'lowlaundry.cpanel.boldlabs.net' || window.shopAlias == 'lowlaundry.com' || window.shopAlias == 'dev.lowlaundry.com' ) {
        cartTerm = 'cart';
    }
    const {link} = getReturnToCartTermAndLink();

    const sectionLabel = getTerm('checkout_steps', Constants.GLOBAL_INFO, undefined , 'Checkout steps');


    const crumbs: Array<IBreadcrumb> = [
        {
            name: 'cart',
            text: getTerm(cartTerm, Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                window.location.href = link;
            },
        },
        {
            name: 'life_fields',
            text: getTerm('life_fields', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                history.replace(getCheckoutUrl(Constants.LIFE_FIELDS_ROUTE));
            },
        },
        {
            name: 'payment_method',
            text: getTerm('payment_method', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                history.replace(getCheckoutUrl(Constants.PAYMENT_ROUTE));
            },
        },
    ];

    return {crumbs, sectionLabel};
}
