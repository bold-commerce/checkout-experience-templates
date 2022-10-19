import {IBreadcrumb} from 'src/types';
import {
    getTerm,
    getBreadcrumbStatus,
    getCheckoutUrl,
    neuroIdSubmitFromBreadcrumb,
    getReturnToCartTermAndLink,
    isBoldPlatform
} from 'src/utils';
import {Constants} from 'src/constants';
import {BrowserHistory} from 'history';

export function getBreadcrumbs(history: BrowserHistory, active: number): Array<IBreadcrumb> {
    let index = 0;
    const cartTerm = isBoldPlatform() ? 'store': 'cart';
    const {link} = getReturnToCartTermAndLink();

    const crumbs: Array<IBreadcrumb> = [
        {
            name: 'cart',
            text: getTerm(cartTerm, Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                neuroIdSubmitFromBreadcrumb(active);
                window.location.href = link;
            },
        },
        {
            name: 'customer_info',
            text: getTerm('customer_info', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                neuroIdSubmitFromBreadcrumb(active);
                history.replace(getCheckoutUrl(''));
            },
        },
        {
            name: 'shipping_lines',
            text: getTerm('shipping_method', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                neuroIdSubmitFromBreadcrumb(active);
                history.replace(getCheckoutUrl(Constants.SHIPPING_ROUTE));
            },
        },
        {
            name: 'payment_method',
            text: getTerm('payment_method', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                neuroIdSubmitFromBreadcrumb(active);
                history.replace(getCheckoutUrl(Constants.PAYMENT_ROUTE));
            },
        },
    ];

    return crumbs;
}
