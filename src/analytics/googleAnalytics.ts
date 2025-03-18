import {ITotals} from 'src/types';
import {IDiscount, ILineItem, IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {IAddressType, ICustomer} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

export function isGoogleAnalyticsEnabled(): boolean {
    return typeof window['gtag'] === 'function' && !!window['google_analytics_tracking_id'] && typeof window['google_analytics_tracking_id'] === 'string';
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

export function isGoogleAnalyticsCustomized(): boolean {
    const isGACustomized = window['google_analytics_is_customized'];
    return typeof isGACustomized !== 'undefined' && (
        isGACustomized === '1'
        || (typeof isGACustomized === 'string' && isGACustomized.toLowerCase() === 'true')
        || isGACustomized === 1
        || isGACustomized === true
    );
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

    if (isGoogleAnalyticsCustomized()) {
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
            items: formatItems(lineItems),
        });

        window['gtag']('event', 'Successful Checkout', {'category': 'Checkout'});
    }
}

export function formatCurrency(amount: number): string {
    return (amount / 100).toFixed(2);
}

export function formatItems(lineItems: Array<ILineItem>): Array<Record<string, unknown>> {
    return lineItems.map(item => ({
        item_id: item.product_data.sku,
        item_name: item.product_data.product_title,
        item_variant: item.product_data.title,
        price: formatCurrency(item.product_data.price),
        quantity: item.product_data.quantity,
    }));
}

export function formatItemsStandardEcommerce(lineItems: Array<ILineItem>): Array<Record<string, unknown>> {
    return lineItems.map(item => ({
        sku: item.product_data.sku,
        name: item.product_data.product_title,
        price: item.product_data.price / 100,
        quantity: item.product_data.quantity,
    }));
}

export function formatTransactionAddress(customer: ICustomer, addresses: IAddressType): Record<string, unknown> {
    return {
        email: (customer.email_address || '').toLocaleLowerCase(),
        firstname: (customer.first_name || '').toLocaleLowerCase(),
        lastname: (customer.last_name || '').toLocaleLowerCase(),
        telephone: (addresses.billing.phone_number || '').replace(/\D/g, ''),
        city: (addresses.billing.city || '').replace(/\s+/g, '').toLocaleLowerCase(),
        region: (addresses.billing.province_code || '').toLocaleLowerCase(),
        postcode: (addresses.billing.postal_code || ''),
        country: (addresses.billing.country_code || '').toLocaleLowerCase(),
    };
}
