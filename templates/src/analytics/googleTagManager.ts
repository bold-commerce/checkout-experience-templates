import {ITotals} from 'src/types';
import {IDiscount, ILineItem, IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {formatCurrency, formatItems} from './googleAnalytics';

export function isGoogleTagManagerEnabled(): boolean {
    return !!window['google_tag_manager_tracking_id'] && typeof window['google_tag_manager_tracking_id'] === 'string';
}

export function sendPageViewForGoogleTagManager(page: string, step?: number): void {
    if(!isGoogleTagManagerEnabled()) {
        return;
    }

    const parameters = {page_location: page};
    if (step) {
        parameters['page_title'] = step;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'page_view',
        ...parameters
    });
}

export function sendEventForGoogleTagManager(event: string, parameters?: Record<string, unknown>): void {
    if(!isGoogleTagManagerEnabled()){
        return;
    }
    const pushData = {event};
    
    if (parameters?.value){
        parameters.value = formatCurrency(<number>parameters.value);
    }
    if (parameters?.items){
        parameters.items = formatItems(<Array<ILineItem>>parameters.items);
    }
    
    window.dataLayer = window.dataLayer || [];
    if (parameters){
        window.dataLayer.push({ecommerce: null});
        pushData['ecommerce'] = parameters;
    }
    window.dataLayer.push(pushData);
}

export function orderCompleteForGoogleTagManager(lineItems: Array<ILineItem>, currency: string, totals: ITotals, shipping: IShippingLine, id: string, discounts: Array<IDiscount>): void {
    if(!isGoogleTagManagerEnabled()){
        return;
    }
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ecommerce: null});
    window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
            currency,
            transaction_id: id,
            value: formatCurrency(totals.totalOrder),
            shipping: formatCurrency(shipping.amount),
            tax: formatCurrency(totals.totalTaxes),
            coupon: discounts.map(d => d.code).join(' '),
            items: formatItems(lineItems),
        },
    });
}
