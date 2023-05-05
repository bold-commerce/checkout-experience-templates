import {isObjectEmpty} from 'src/utils';
import {ITotals} from 'src/types';
import {IDiscount, ILineItem, IShippingLine} from '@boldcommerce/checkout-frontend-library';

export function isGoogleAnalyticsEnabled(): boolean {
    return typeof window['gtag'] === 'function'&& !!window['google_analytics_tracking_id'] && typeof window['google_analytics_tracking_id'] === 'string';
}

export function sendPageViewForGoogleAnalytics(page: string, step?: number) : void {
    if(!isGoogleAnalyticsEnabled()){
        return;
    }

    const parameters = {page_location: page};
    if (step) {
        parameters['page_title'] = step;
    }
    window['gtag']('event', 'page_view', parameters);
}

export function sendEventForGoogleAnalytics(event: string, parameters?: Record<string, unknown>) : void {
    if(!isGoogleAnalyticsEnabled()){
        return;
    }

    if (parameters?.value){
        parameters.value = formatCurrency(<number>parameters.value);
    }
    if (parameters?.items){
        parameters.items = formatItems(<Array<ILineItem>>parameters.items);
    }
    window['gtag']('event', event, parameters ?? {});
}

export function orderCompleteForGoogleAnalytics(lineItems: Array<ILineItem>, currency: string, totals: ITotals, shipping: IShippingLine, id: string, discounts: Array<IDiscount>): void {
    if(!isGoogleAnalyticsEnabled()){
        return;
    }

    if (!isObjectEmpty({analytics: window['google_analytics_is_customized']}) && window['google_analytics_is_customized'] == '1') {
        const googleScript = document.createElement('script');
        googleScript.type = 'text/javascript';
        googleScript.innerHTML = window['google_analytics_order_complete_script'];
        document.head.appendChild(googleScript);
    } else {
        window['gtag']('event', 'purchase', {
            currency,
            transaction_id: id,
            value: formatCurrency(totals.totalOrder),
            shipping: formatCurrency(shipping.amount),
            tax: formatCurrency(totals.totalTaxes),
            coupon: discounts.map(d => d.code).join(' '),
            items: formatItems(lineItems)
        });

        window['gtag']('event', 'Successful Checkout', {'category': 'Checkout'});
    }
}

function formatCurrency(amount: number): string{
    return (amount / 100).toFixed(2);
}

function formatItems(lineItems: Array<ILineItem>) {
    return lineItems.map(item => ({
        item_id: item.product_data.sku,
        item_name: item.product_data.product_title,
        item_variant: item.product_data.title,
        price: formatCurrency(item.product_data.price),
        quantity: item.product_data.quantity,
    }));
}
