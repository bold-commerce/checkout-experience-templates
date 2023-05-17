import {
    sendFacebookEvent,
    sendEventForGoogleAnalytics,
    initiateCheckoutForFacebookPixel,
    sendPageViewForGoogleAnalytics,
    sendPageViewForFacebookPixel,
    orderCompleteForGoogleAnalytics,
    orderCompletedForFacebookPixel,
    orderCompleteForCustomAnalytics,
    orderCompleteTrackingVariables,
    orderCompleteForGoogleTagManager,
} from 'src/analytics';
import {ITotals} from 'src/types';
import {IAddressType, ICustomer, IDiscount, ILineItem, IShippingLine} from '@boldcommerce/checkout-frontend-library';


export function initiateCheckout(): void {
    initiateCheckoutForFacebookPixel();
}

export function sendEvents(event: string, parameters?: Record<string, unknown>): void {
    sendFacebookEvent(event);
    sendEventForGoogleAnalytics(event, parameters);
}

export function sendPageView(page: string, step?: number): void {
    sendPageViewForGoogleAnalytics(page, step);
    sendPageViewForFacebookPixel(page);
}

export function orderCompleteAnalytics(customer:ICustomer, addresses: IAddressType, lineItems: Array<ILineItem>, currency: string, totals: ITotals, shipping: IShippingLine, id: string, discounts: Array<IDiscount>): void {
    orderCompleteTrackingVariables(customer, addresses, lineItems, currency, totals, shipping, id, discounts);
    orderCompleteForGoogleAnalytics(lineItems, currency, totals, shipping, id, discounts);
    orderCompletedForFacebookPixel(lineItems, currency, totals);
    orderCompleteForGoogleTagManager(customer, addresses, lineItems, currency, totals, shipping, id, discounts);
    orderCompleteForCustomAnalytics();
}
