import {IBreadcrumb, IBreadcrumbs} from 'src/types';
import {
    getTerm,
    getBreadcrumbStatus,
    getCheckoutUrl,
    getReturnToCartTermAndLink,
    isBoldPlatform
} from 'src/utils';
import {Constants, LifeInputLocationConstants} from 'src/constants';
import {BrowserHistory} from 'history';
import {useGetLifeFields} from 'src/hooks';

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
            name: 'additional_information',
            text: getTerm('additional_information', Constants.GLOBAL_INFO),
            status: getBreadcrumbStatus(index++, active),
            onClick: (event) => {
                event.preventDefault();
                history.replace(getCheckoutUrl(''));
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

    const paypalAdditionalInformation = useGetLifeFields(LifeInputLocationConstants.PAYPAL_ADDITIONAL_INFORMATION);
    if (paypalAdditionalInformation === undefined || paypalAdditionalInformation.length == 0) {
        crumbs.splice(crumbs.findIndex(el => el.name === 'additional_information'), 1);
    }

    return {crumbs, sectionLabel};
}
