import {getTotals} from 'src/utils';
import {initialDataMock} from 'src/mocks';

describe('testing getTotals', () => {

    const paymentMock = {...initialDataMock.application_state.payments[0], value: undefined};
    const paymentsMock = [paymentMock];
    const dataProvider = [
        {
            name: 'getTotals with success',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: initialDataMock.application_state.taxes,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockShipping: {
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 1999
            },
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22099,
                totalAmountDue: 2099,
                totalPaid: 20000,
                totalFees: 100,
                totalTaxes: 10,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without line items array',
            mockLineItems: [],
            mockPayments: paymentsMock,
            mockTaxes: initialDataMock.application_state.taxes,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockShipping: {
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 1999
            },
            mockTotals: {
                totalSubtotal: 0,
                totalOrder: 1999,
                totalAmountDue: -18001,
                totalPaid: 20000,
                totalFees: 0,
                totalTaxes: 10,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without payments array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: [],
            mockTaxes: initialDataMock.application_state.taxes,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockShipping: {
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 1999
            },
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22099,
                totalAmountDue: 22099,
                totalPaid: 0,
                totalFees: 100,
                totalTaxes: 10,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without taxes array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: [],
            mockDiscounts: initialDataMock.application_state.discounts,
            mockShipping: {
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 1999
            },
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22089,
                totalAmountDue: 2089,
                totalPaid: 20000,
                totalFees: 100,
                totalTaxes: 0,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without discounts array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: initialDataMock.application_state.taxes,
            mockDiscounts: [],
            mockShipping: {
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 1999
            },
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22109,
                totalAmountDue: 2109,
                totalPaid: 20000,
                totalFees: 100,
                totalTaxes: 10,
                totalDiscounts: 0
            }
        },
    ];

    test.each(dataProvider)(
        '$name',
        ({name, mockLineItems, mockPayments, mockTaxes, mockDiscounts, mockShipping, mockTotals}) => {
            const totals = getTotals(mockLineItems, mockPayments, mockTaxes, mockDiscounts, mockShipping);
            expect(totals).toStrictEqual(mockTotals);
        });
});
