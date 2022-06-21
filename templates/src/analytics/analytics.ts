import {
    sendFacebookEvent,
    sendEventForGoogleAnalytics,
    initiateCheckoutForFacebookPixel,
    sendPageViewForGoogleAnalytics,
    sendPageViewForFacebookPixel,
    orderCompleteForGoogleAnalytics,
    orderCompletedForFacebookPixel,
    orderCompleteForCustomAnalytics
} from 'src/analytics';
import {ITotals} from 'src/types';
import {ILineItem, IShippingLine} from '@bold-commerce/checkout-frontend-library';


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

export function orderCompleteAnalytics(lineItems: Array<ILineItem>, currency: string, totals: ITotals, shipping: IShippingLine): void {
    orderCompleteForGoogleAnalytics(lineItems, currency, totals, shipping);
    orderCompletedForFacebookPixel(lineItems, currency, totals);
    orderCompleteForCustomAnalytics();
}
