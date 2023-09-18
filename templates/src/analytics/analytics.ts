import {
    sendFacebookEvent,
    sendEventForGoogleAnalytics,
    initiateCheckoutForFacebookPixel,
    sendPageViewForGoogleAnalytics,
    sendPageViewForGoogleTagManager,
    sendPageViewForFacebookPixel,
    orderCompleteForGoogleAnalytics,
    orderCompleteForFacebookPixel,
    orderCompleteForCustomAnalytics,
    orderCompleteTrackingVariables,
    orderCompleteForGoogleTagManager,
    sendEventForGoogleTagManager,
} from 'src/analytics';
import {ITotals} from 'src/types';
import {IAddressType, ICustomer, IDiscount, ILineItem, IShippingLine} from '@boldcommerce/checkout-frontend-library';


export function initiateCheckout(items: Array<ILineItem>, value: number, currency: string): void {
    initiateCheckoutForFacebookPixel();
    sendEventForGoogleAnalytics('begin_checkout', {items, value, currency});
    sendEventForGoogleTagManager('begin_checkout', {items, value, currency});
}

export function sendEvents(event: string, parameters?: Record<string, unknown>): void {
    sendFacebookEvent(event);
    sendEventForGoogleAnalytics(event, parameters);
    sendEventForGoogleTagManager(event, parameters);
}

export function sendPageView(page: string, step?: number): void {
    sendPageViewForGoogleAnalytics(page, step);
    sendPageViewForGoogleTagManager(page, step);
    sendPageViewForFacebookPixel(page);
}

export function orderCompleteAnalytics(customer:ICustomer, addresses: IAddressType, lineItems: Array<ILineItem>, currency: string, totals: ITotals, shipping: IShippingLine, id: string, discounts: Array<IDiscount>): void {
    orderCompleteTrackingVariables(customer, addresses, lineItems, currency, totals, shipping, id, discounts);
    orderCompleteForGoogleAnalytics(lineItems, currency, totals, shipping, id, discounts);
    orderCompleteForFacebookPixel(lineItems, currency, totals);
    orderCompleteForGoogleTagManager(lineItems, currency, totals, shipping, id, discounts);
    orderCompleteForCustomAnalytics();
}
