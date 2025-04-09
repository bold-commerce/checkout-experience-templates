import {orderCompleteForGoogleTagManager, sendEventForGoogleTagManager, sendPageViewForGoogleTagManager} from 'src/analytics';
import {stateMock} from 'src/mocks';
import {ITotals} from 'src/types';

describe('testing Google Tag Manager functions', () => {
    const appState = stateMock.data.application_state;
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 22099,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalAdditionalFees: 0,
        totalTaxes: 1000,
        totalDiscounts: 0
    };

    beforeEach(() => {
        window.google_tag_manager_tracking_id = 'string';
        window.dataLayer = undefined;
    });

    test('test pageView function with step', () => {
        sendPageViewForGoogleTagManager('page', 1);

        const expected = [
            {
                event: 'page_view',
                page_location: 'page',
                page_title: 1,
            }
        ];
        expect(window.dataLayer).toEqual(expected);
    });
    test('test pageView function without step', () => {
        sendPageViewForGoogleTagManager('page');

        const expected = [
            {
                event: 'page_view',
                page_location: 'page',
            }
        ];
        expect(window.dataLayer).toEqual(expected);
    });

    test('test event function without parameters', () => {
        sendEventForGoogleTagManager('test');
        const expected = [
            {event: 'test'}
        ];
        expect(window.dataLayer).toEqual(expected);
    });

    test('test event function with parameters', () => {
        sendEventForGoogleTagManager('paras', {
            one: 1,
            two: 'II',
            three: 'tree',
        });
        const expected = [
            {ecommerce: null},
            {
                event: 'paras',
                ecommerce: {
                    one: 1,
                    two: 'II',
                    three: 'tree',
                }
            }
        ];
        expect(window.dataLayer).toEqual(expected);
    });
    
    test('test event function with value parameter', () => {
        sendEventForGoogleTagManager('value', {value: 1337});

        const expected = [
            {ecommerce: null},
            {
                event: 'value',
                ecommerce: {value: '13.37',}
            }
        ];
        expect(window.dataLayer).toEqual(expected);
    });
    
    test('test event function with items parameter', () => {
        sendEventForGoogleTagManager('items', {items: appState.line_items});

        const expected = [
            {ecommerce: null},
            {
                event: 'items',
                ecommerce: {
                    items: [{
                        item_id: 'CLC',
                        item_name: '[Sample] Canvas Laundry Cart',
                        item_variant: 'Default Title',
                        price: '200.00',
                        quantity: 1,
                    }],
                }
            }
        ];
        expect(window.dataLayer).toEqual(expected);
    });

    test('test orderComplete function', () => {
        orderCompleteForGoogleTagManager(appState.line_items, appState.currency.iso_code, totals, appState.shipping.selected_shipping, '123', appState.discounts);

        const expected = [
            {ecommerce: null},
            {
                event: 'purchase',
                ecommerce: {
                    currency: 'CAD',
                    transaction_id: '123',
                    value: '220.99',
                    shipping: '0.20',
                    tax: '10.00',
                    coupon: 'Test Discount Code',
                    items: [{
                        item_id: 'CLC',
                        item_name: '[Sample] Canvas Laundry Cart',
                        item_variant: 'Default Title',
                        price: '200.00',
                        quantity: 1,
                    }],
                }
            }
        ];

        expect(window.dataLayer).toEqual(expected);
    });

    test('test enabled function', () => {
        window.google_tag_manager_tracking_id = 123;
        orderCompleteForGoogleTagManager(appState.line_items, appState.currency.iso_code, totals, appState.shipping.selected_shipping, '123', appState.discounts);

        expect(window.dataLayer).toBe(undefined);
    });
});
