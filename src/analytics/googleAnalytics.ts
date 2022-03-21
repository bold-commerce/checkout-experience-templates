import {isObjectEmpty} from 'src/utils';
import {IApplicationStateLineItem, IApplicationStateSelectShippingLine, ITotals} from 'src/types';

export function isGoogleAnalyticsEnabled(): boolean {
    return typeof window['ga'] === 'function'&& !!window['google_analytics_tracking_id'] && typeof window['google_analytics_tracking_id'] === 'string';
}

export function sendPageViewForGoogleAnalytics(page: string, step?: number) : void {
    if(!isGoogleAnalyticsEnabled()){
        return;
    }

    if (!isObjectEmpty({step})) {
        window['ga']('require', 'ec');
        window['ga']('ec:setAction', 'checkout', { step });
    }
    window['ga']('set', 'page', page);
    window['ga']('send', 'pageview');
}

export function sendEventForGoogleAnalytics(event: string, category: string) : void {

    if(!isGoogleAnalyticsEnabled()){
        return;
    }
    window['ga']('send', 'event', category, event);
}


export function orderCompleteForGoogleAnalytics(lineItems: Array<IApplicationStateLineItem>, currency: string, totals: ITotals, shipping: IApplicationStateSelectShippingLine): void {

    if(!isGoogleAnalyticsEnabled()){
        return;
    }

    if (!isObjectEmpty({analytics: window['google_analytics_is_customized']}) && window['google_analytics_is_customized'] == '1') {
        const googleScript = document.createElement('script');
        googleScript.type = 'text/javascript';
        googleScript.innerHTML = window['google_analytics_order_complete_script'];
        document.head.appendChild(googleScript);
    }
    else {
        window['ga']('require', 'ec');
        window['ga']('set', 'currencyCode', currency);

        lineItems.forEach(item => {
            window['ga']('ec:addProduct', {
                id: item.product_data.sku,
                name: item.product_data.product_title,
                variant: item.product_data.title,
                price: formatCurrency(item.product_data.price),
                quantity: item.product_data.quantity,
            });
        });

        window['ga']('ec:setAction', 'purchase', {
            revenue: formatCurrency(totals.totalOrder),
            shipping: formatCurrency(shipping.amount),
            tax: formatCurrency(totals.totalTaxes),
        });

        window['ga']('send', 'event', 'Checkout', 'Successful Checkout');
    }
}


function formatCurrency(amount: number): string{
    return (amount / 100).toFixed(2);
}
