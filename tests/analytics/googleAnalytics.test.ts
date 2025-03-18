import { IDiscount } from '@boldcommerce/checkout-frontend-library';
import {
    isGoogleAnalyticsEnabled,
    orderCompleteForGoogleAnalytics,
    sendEventForGoogleAnalytics,
    sendPageViewForGoogleAnalytics
} from 'src/analytics';
import {stateMock} from 'src/mocks';
import {ITotals} from 'src/types';

describe('testing Google Analytics implementation', () => {
    const appState = stateMock.data.application_state;
    const selectedShippingLine = {
        id: 'shipping_id_1',
        description: 'USPS ground carrier',
        amount: 1999,
        code: '',
    };

    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 22099,
        totalAmountDue: 0,
        totalAdditionalFees: 0,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 10,
        totalDiscounts: 0
    };

    const discounts: Array<IDiscount> = [
        { code: 'test_code', text: 'code text', value: 100, valid: true, },
        { code: 'code_test', text: 'code text', value: 200, valid: true, }
    ];

    const script = 'console.log("Testing Custom Script");';

    const gtagMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        document.head.innerHTML = '';
        window['gtag'] = gtagMock;
        window['google_analytics_is_customized'] = undefined;
        window['google_analytics_order_complete_script'] = script;
    });


    test('testing isGoogleAnalyticsEnabled function', ()=> {

        window['gtag'] = undefined;
        let result = isGoogleAnalyticsEnabled();
        expect(result).toBe(false);
        window['gtag'] = gtagMock;

        window['google_analytics_tracking_id'] = undefined;
        result = isGoogleAnalyticsEnabled();
        expect(result).toBe(false);

        window['google_analytics_tracking_id'] = 'UA-12345678-9';
        result = isGoogleAnalyticsEnabled();
        expect(result).toBe(true);
    });

    test('testing sendPageViewForGoogleAnalytics function without ga defined', ()=> {
        const page = 'test';
        window['gtag'] = undefined;
        sendPageViewForGoogleAnalytics(page);
        expect(gtagMock).toHaveBeenCalledTimes(0);
    });

    test('testing sendPageViewForGoogleAnalytics function', ()=> {
        const page = 'test';
        const step = 2;

        sendPageViewForGoogleAnalytics(page);

        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', { 'page_location': page });

        sendPageViewForGoogleAnalytics(page, step);

        expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', { 'page_location': page, 'page_title': step });
    });

    test('testing sendEventForGoogleAnalytics function without gtag defined', ()=> {
        const event = 'test-event';
        const parameters = {'category': 'test-category'};

        window['gtag'] = undefined;
        sendEventForGoogleAnalytics(event, parameters);
        expect(gtagMock).toHaveBeenCalledTimes(0);
    });

    test('testing sendEventForGoogleAnalytics without parameters function', ()=> {
        const event = 'custom';

        sendEventForGoogleAnalytics(event);

        expect(gtagMock).toHaveBeenCalledWith('event', event, {});
    });

    test('testing sendEventForGoogleAnalytics with parameters function', ()=> {
        const event = 'test-event';
        const rawParameters = {id: '1', value:'1999', items:[{
            product_data: {
                sku: 'abc123',
                product_title: 'title',
                title: 'variant',
                price: '2023',
                quantity: 2
            }
        }]};
        const formattedParameters = {id: '1', value: '19.99', items: [{  
            item_id: 'abc123',
            item_name: 'title',
            item_variant: 'variant',
            price: '20.23',
            quantity: 2
        }]};

        sendEventForGoogleAnalytics(event, rawParameters);

        expect(gtagMock).toHaveBeenCalledWith('event', event, formattedParameters);

    });

    test('testing orderCompleteForGoogleAnalytics function without ga defined', ()=> {
        window['gtag'] = undefined;
        orderCompleteForGoogleAnalytics(appState.line_items, 'USD', totals ,selectedShippingLine, '1', []);
        expect(gtagMock).toHaveBeenCalledTimes(0);
    });

    test('testing orderCompleteForGoogleAnalytics function without custom script', ()=> {
        orderCompleteForGoogleAnalytics(appState.line_items, 'USD', totals ,selectedShippingLine, '1', discounts);
        expect(gtagMock).toHaveBeenCalledWith('event', 'purchase', {
            'currency': 'USD',
            'transaction_id': '1',
            'value': '220.99',
            'shipping': '19.99',
            'tax': '0.10',
            'coupon': 'test_code code_test',
            'items': [{
                'item_id': 'CLC',
                'item_name': '[Sample] Canvas Laundry Cart',
                'item_variant': 'Default Title',
                'price': '200.00',
                'quantity': 1,
            }]
        });
        expect(gtagMock).toHaveBeenCalledWith('event', 'Successful Checkout', {'category': 'Checkout'});
    });

    const orderCompleteCustomizedTestData = [
        { name: 'as string 1', isCustomized: '1'},
        { name: 'as string true', isCustomized: 'true'},
        { name: 'as string tRue', isCustomized: 'tRue'},
        { name: 'as number 1', isCustomized: 1},
        { name: 'as boolean true', isCustomized: true},
    ];

    test.each(orderCompleteCustomizedTestData)('orderCompleteForGoogleAnalytics with google_analytics_is_customized $name',
        ({isCustomized}) => {
            window['google_analytics_is_customized'] = isCustomized;

            orderCompleteForGoogleAnalytics(appState.line_items, 'USD', totals, selectedShippingLine, '1', []);
            expect(gtagMock).toHaveBeenCalledTimes(0);
            expect(document.head.childNodes.length).toBe(1);
            expect(document.head.children[0].innerHTML).toContain(script);
        });

});
