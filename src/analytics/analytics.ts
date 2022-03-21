import {
    sendFacebookEvent,
    sendEventForGoogleAnalytics,
    initiateCheckoutForFacebookPixel,
    sendPageViewForGoogleAnalytics,
    sendPageViewForFacebookPixel,
    orderCompleteForGoogleAnalytics,
    orderCompletedForFacebookPixel
} from 'src/analytics';
import {IApplicationStateLineItem, IApplicationStateSelectShippingLine, ITotals} from 'src/types';


export function initiateCheckout(): void {
    initiateCheckoutForFacebookPixel();
}

export function sendEvents(category: string, event: string): void {
    sendFacebookEvent(event);
    sendEventForGoogleAnalytics(event, category);
}

export function sendPageView(page: string, step?: number): void {
    sendPageViewForGoogleAnalytics(page, step);
    sendPageViewForFacebookPixel(page);
}

export function orderCompleteAnalytics(lineItems: Array<IApplicationStateLineItem>, currency: string, totals: ITotals, shipping: IApplicationStateSelectShippingLine): void {
    orderCompleteForGoogleAnalytics(lineItems, currency, totals, shipping);
    orderCompletedForFacebookPixel(lineItems, currency, totals);
}
