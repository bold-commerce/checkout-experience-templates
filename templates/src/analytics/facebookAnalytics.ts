import {isObjectEmpty} from 'src/utils';
import {ITotals} from 'src/types';
import {ILineItem} from '@boldcommerce/checkout-frontend-library';

export function isFacebookPixelInstalled(): boolean {
    return typeof window['fbq'] === 'function' && typeof window['facebook_analytics_tracking_id'] === 'string' && !!window['facebook_analytics_tracking_id'] && window['facebook_analytics_tracking_id'].trim() !== '';
}

export function sendFacebookEvent(event: string, data = {}): void {
    if (!isFacebookPixelInstalled()) {
        return;
    }

    window['fbq']('dataProcessingOptions', ['LDU'], 0, 0);
    window['fbq'](getTrackType(event), event, data);
}

export function initiateCheckoutForFacebookPixel(): void {
    sendFacebookEvent('InitiateCheckout');
}

export function sendPageViewForFacebookPixel(page: string): void {
    sendFacebookEvent('PageView', {page});
}

export function sendEventForFacebookPixel(event: string): void {
    sendFacebookEvent(event);
}

export function addPaymentInfoForFacebookPixel(value: string, currency: string): void {
    sendFacebookEvent('AddPaymentInfo', {value, currency});
}

export function orderCompletedForFacebookPixel(lineItems: Array<ILineItem>, currency: string, totals: ITotals): void {

    if (!isFacebookPixelInstalled()) {
        return;
    }

    if (!isObjectEmpty({analytics: window['facebook_analytics_is_customized']}) && window['facebook_analytics_is_customized'] == '1') {
        const facebookScript = document.createElement('script');
        facebookScript.type = 'text/javascript';
        facebookScript.innerHTML = window['facebook_analytics_order_complete_script'];
        document.head.appendChild(facebookScript);
    } else {

        sendFacebookEvent('Purchase', {
            'value': totals.totalOrder,
            'currency': currency,
            'contents': lineItems,
            'content_type': 'product',
            'content_ids': lineItems
                .filter(line_item => line_item.product_data.variant_id) // not undefined and not null
                .map(line_item => line_item.product_data.variant_id),
        });
    }
}

export function getTrackType(event: string): string {
    const standard_event = [
        'ViewContent',
        'Search',
        'AddToCart',
        'AddToWishlist',
        'InitiateCheckout',
        'AddPaymentInfo',
        'Purchase',
        'Lead',
        'CompleteRegistration'
    ];
    if (standard_event.indexOf(event) !== -1) {
        return 'track';
    } else {
        return 'trackCustom';
    }
}
