import {ITotals} from 'src/types';
import {orderCompleteTrackingVariables} from 'src/analytics';
import {stateMock} from 'src/mocks';

describe('testing Google Tag Manager functions', () => {
    const appState = stateMock.data.application_state;
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 220.99,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalAdditionalFees: 0,
        totalTaxes: 0.10,
        totalDiscounts: 0
    };

    test('test orderComplete function', () => {
        orderCompleteTrackingVariables(appState.customer, appState.addresses, appState.line_items, appState.currency.iso_code, totals, appState.shipping.selected_shipping, '123', appState.discounts);

        const expected = {
            'order': {
                'customer': {
                    'email': 'john.doe@boldcommerce.com'
                },
                'shipping_address': {
                    'province_code': 'MB',
                    'country_code': 'CA'
                },
                'billing_address': {
                    'province_code': 'MB',
                    'country_code': 'CA'
                },
                'line_items': [
                    {
                        'product_data': {
                            'id': '71',
                            'title': 'Default Title',
                            'product_title': '[Sample] Canvas Laundry Cart',
                            'image_url': 'https://cdn11.bigcommerce.com/s-hk1wztnmcg/products/103/images/334/naturalcanvascart2.1624043582.220.290.jpg?c=1',
                            'properties': {},
                            'description': '',
                            'quantity': 1,
                            'price': 20000,
                            'total_price': 20000,
                            'visible': true,
                            'line_item_key': '1k3xd',
                            'barcode': '',
                            'compare_at_price': 20000,
                            'weight': 1,
                            'weight_unit': 'kg',
                            'product_id': '',
                            'variant_id': '0',
                            'requires_shipping': true,
                            'sku': 'CLC',
                            'taxable': true,
                            'tags': '',
                            'vendor': ''
                        },
                        'taxes': [],
                        'fees': [
                            {
                                'name': 'test',
                                'amount': 100
                            }
                        ],
                        'discounts': []
                    }
                ],
                'currency': 'CAD',
                'totals': {
                    'totalSubtotal': 0,
                    'totalOrder': 220.99,
                    'totalAmountDue': 0,
                    'totalPaid': 0,
                    'totalFees': 0,
                    'totalAdditionalFees': 0,
                    'totalTaxes': 0.1,
                    'totalDiscounts': 0
                },
                'shipping': {
                    'id': 'shipping_id_1',
                    'description': 'USPS ground carrier',
                    'amount': 19.99,
                    'code' : '',
                },
                'discounts': [
                    {
                        'code': 'Test Discount Code',
                        'text': 'Test Text',
                        'valid': true,
                        'value': 10
                    }
                ],
                'id': '123'
            }
        };

        expect(window.BOLD).toEqual(expected);
    });
});
