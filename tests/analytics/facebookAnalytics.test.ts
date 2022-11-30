import {stateMock} from 'src/mocks';
import {
    addPaymentInfoForFacebookPixel,
    getTrackType,
    initiateCheckoutForFacebookPixel,
    isFacebookPixelInstalled,
    orderCompletedForFacebookPixel,
    sendEventForFacebookPixel,
    sendFacebookEvent,
    sendPageViewForFacebookPixel,
} from 'src/analytics';
import {ITotals} from 'src/types';

describe('testing facebook Analytics implementation', () => {
    window = Object.create(window);
    const appState = stateMock.data.application_state;
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 220.99,
        totalAmountDue: 0,
        totalPaid: 0,
        totalAdditionalFees: 0,
        totalFees: 0,
        totalTaxes: 0.10,
        totalDiscounts: 0
    };

    let fbqSpy;

    beforeEach(() => {
        window['fbq'] = jest.fn();
        fbqSpy = jest.spyOn((window as any), 'fbq');
    });

    test('testing isFacebookPixelInstalled function', () => {

        window['fbq'] = undefined;
        let result = isFacebookPixelInstalled();
        expect(result).toBe(false);
        window['fbq'] = jest.fn();

        window['facebook_analytics_tracking_id'] = undefined;
        result = isFacebookPixelInstalled();
        expect(result).toBe(false);

        window['facebook_analytics_tracking_id'] = '';
        result = isFacebookPixelInstalled();
        expect(result).toBe(false);

        window['facebook_analytics_tracking_id'] = 'UA-12345678-9';
        result = isFacebookPixelInstalled();
        expect(result).toBe(true);
    });

    test('testing sendFacebookEvent function without fbq defined', () => {
        const page = 'test';
        window['fbq'] = undefined;
        sendFacebookEvent(page);
        expect(fbqSpy).toHaveBeenCalledTimes(0);
    });

    test('testing sendFacebookEvent function with fbq defined', () => {
        sendFacebookEvent('testing');
        expect(fbqSpy).toHaveBeenCalledWith('dataProcessingOptions', ['LDU'], 0, 0);
        expect(fbqSpy).toHaveBeenCalledWith('trackCustom', 'testing', {});

    });

    test('testing initiateCheckoutForFacebookPixel function', () => {
        initiateCheckoutForFacebookPixel();
        expect(fbqSpy).toHaveBeenCalledWith('dataProcessingOptions', ['LDU'], 0, 0);
        expect(fbqSpy).toHaveBeenCalledWith('track', 'InitiateCheckout', {});

    });

    test('testing sendPageViewForFacebookPixel function', () => {
        const page = 'test';
        sendPageViewForFacebookPixel(page);
        expect(fbqSpy).toHaveBeenCalledWith('dataProcessingOptions', ['LDU'], 0, 0);
        expect(fbqSpy).toHaveBeenCalledWith('trackCustom', 'PageView', {page});

    });

    test('testing sendEventForFacebookPixel function', () => {
        const event = 'test';
        sendEventForFacebookPixel(event);
        expect(fbqSpy).toHaveBeenCalledWith('dataProcessingOptions', ['LDU'], 0, 0);
        expect(fbqSpy).toHaveBeenCalledWith('trackCustom', event, {});

    });

    test('testing addPaymentInfoForFacebookPixel function', () => {
        const value = '20';
        const currency = 'USD';
        addPaymentInfoForFacebookPixel(value, currency);
        expect(fbqSpy).toHaveBeenCalledWith('dataProcessingOptions', ['LDU'], 0, 0);
        expect(fbqSpy).toHaveBeenCalledWith('track', 'AddPaymentInfo', {value, currency});

    });

    test('testing getTrackType function', () => {
        let result = getTrackType('ViewContent');
        expect(result).toBe('track');

        result = getTrackType('test');
        expect(result).toBe('trackCustom');
    });

    test('testing orderCompletedForFacebookPixel function without fbq defined', () => {
        window['fbq'] = undefined;
        orderCompletedForFacebookPixel(appState.line_items, 'USD', totals );
        expect(fbqSpy).toHaveBeenCalledTimes(0);
    });

    test('testing orderCompletedForFacebookPixel function', () => {
        orderCompletedForFacebookPixel(appState.line_items, 'USD', totals );
        expect(fbqSpy).toHaveBeenCalledWith('dataProcessingOptions', ['LDU'], 0, 0);
        expect(fbqSpy).toHaveBeenCalledWith('track', 'Purchase', {
            value: 220.99,
            contents: appState.line_items,
            content_type: 'product',
            currency: 'USD',
            content_ids: ['0']
        });

    });

    test('testing orderCompletedForFacebookPixel function with custom script', ()=> {
        const script = 'const test = 1';
        window['facebook_analytics_is_customized'] = 1;
        window['facebook_analytics_order_complete_script'] = script;

        orderCompletedForFacebookPixel(appState.line_items, 'USD', totals );
        expect(fbqSpy).toHaveBeenCalledTimes(0);
        expect(document.head.childNodes.length).toBe(1);
        expect(document.head.children[0].innerHTML).toContain(script);

    });


});
