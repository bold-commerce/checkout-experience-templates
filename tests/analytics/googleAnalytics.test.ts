import {
    isGoogleAnalyticsEnabled,
    orderCompleteForGoogleAnalytics,
    sendEventForGoogleAnalytics,
    sendPageViewForGoogleAnalytics
} from 'src/analytics';
import {stateMock} from 'src/mocks';
import {ITotals} from 'src/types';

describe('testing Google Analytics implementation', () => {
    window = Object.create(window);
    const appState = stateMock.data.application_state;
    const selectedShippingLine = {
        id: 'shipping_id_1',
        description: 'USPS ground carrier',
        amount: 1999
    };

    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 22099,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 0.10,
        totalDiscounts: 0
    };

    let gaSpy;

    beforeEach(() => {
        window['ga'] = jest.fn();
        gaSpy = jest.spyOn((window as any), 'ga');
    });


    test('testing isGoogleAnalyticsEnabled function', ()=> {

        window['ga'] = undefined;
        let result = isGoogleAnalyticsEnabled();
        expect(result).toBe(false);
        window['ga'] = jest.fn();

        window['google_analytics_tracking_id'] = undefined;
        result = isGoogleAnalyticsEnabled();
        expect(result).toBe(false);

        window['google_analytics_tracking_id'] = 'UA-12345678-9';
        result = isGoogleAnalyticsEnabled();
        expect(result).toBe(true);
    });

    test('testing sendPageViewForGoogleAnalytics function without ga defined', ()=> {
        const page = 'test';
        window['ga'] = undefined;
        sendPageViewForGoogleAnalytics(page);
        expect(gaSpy).toHaveBeenCalledTimes(0);
    });

    test('testing sendPageViewForGoogleAnalytics function', ()=> {
        const page = 'test';
        const step = 2;

        sendPageViewForGoogleAnalytics(page);

        expect(gaSpy).not.toHaveBeenCalledWith('require', 'ec');
        expect(gaSpy).not.toHaveBeenCalledWith('ec:setAction', 'checkout', step);
        expect(gaSpy).toHaveBeenCalledWith('set', 'page', page);
        expect(gaSpy).toHaveBeenCalledWith('send', 'pageview');

        sendPageViewForGoogleAnalytics(page, step);

        expect(gaSpy).toHaveBeenCalledWith('require', 'ec');
        expect(gaSpy).toHaveBeenCalledWith('ec:setAction', 'checkout', {step});

    });

    test('testing sendEventForGoogleAnalytics function without ga defined', ()=> {
        const event = 'test';
        const category = 'test-category';

        window['ga'] = undefined;
        sendEventForGoogleAnalytics(event, category);
        expect(gaSpy).toHaveBeenCalledTimes(0);
    });

    test('testing sendEventForGoogleAnalytics function', ()=> {
        const event = 'test';
        const category = 'test-category';

        sendEventForGoogleAnalytics(event, category);

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', category, event);

    });

    test('testing orderCompleteForGoogleAnalytics function without ga defined', ()=> {
        window['ga'] = undefined;
        orderCompleteForGoogleAnalytics(appState.line_items, 'USD', totals ,selectedShippingLine );
        expect(gaSpy).toHaveBeenCalledTimes(0);
    });

    test('testing orderCompleteForGoogleAnalytics function without custom script', ()=> {
        orderCompleteForGoogleAnalytics(appState.line_items, 'USD', totals ,selectedShippingLine );
        expect(gaSpy).toHaveBeenCalledWith('require', 'ec');
        expect(gaSpy).toHaveBeenCalledWith('ec:addProduct',
            {'id': 'CLC', 'name': '[Sample] Canvas Laundry Cart', 'price': '200.00', 'quantity': 1, 'variant': 'Default Title'}
        );
        expect(gaSpy).toHaveBeenCalledWith('set', 'currencyCode', 'USD');

        expect(gaSpy).toHaveBeenCalledWith('send', 'event', 'Checkout', 'Successful Checkout');
    });

    test('testing orderCompleteForGoogleAnalytics function with custom script', ()=> {
        const script = 'console.log(\'error\')';
        window['google_analytics_is_customized'] = 1;
        window['google_analytics_order_complete_script'] = script;

        orderCompleteForGoogleAnalytics(appState.line_items, 'USD', totals ,selectedShippingLine );
        expect(gaSpy).toHaveBeenCalledTimes(0);

    });

});
