import {IBreadcrumb} from 'src/types';
import {getTerm, getBreadcrumbStatus, getCheckoutUrl, neuroIdSubmitFromBreadcrumb} from 'src/utils';
import {Constants} from 'src/constants';
import {BrowserHistory} from 'history';

export function getBreadcrumbs(history: BrowserHistory, active: number): Array<IBreadcrumb> {
    let index = 0;

    const crumbs: Array<IBreadcrumb> = [
        {
            name: 'cart',
            text: getTerm('cart', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                neuroIdSubmitFromBreadcrumb(active);
                window.location.href = window.returnUrl;
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
                history.replace(getCheckoutUrl('/shipping_lines'));
            },
        },
        {
            name: 'payment_method',
            text: getTerm('payment_method', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                neuroIdSubmitFromBreadcrumb(active);
                history.replace(getCheckoutUrl('/payment'));
            },
        },
    ];

    return crumbs;
}
