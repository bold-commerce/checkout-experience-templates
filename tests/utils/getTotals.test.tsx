import {getTotals} from 'src/utils';
import {initialDataMock} from 'src/mocks';
import {feesMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

describe('testing getTotals', () => {

    const paymentMock = {...initialDataMock.application_state.payments[0], value: undefined};
    const paymentsMock = [paymentMock];
    const dataProvider = [
        {
            name: 'getTotals with success',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: initialDataMock.application_state.taxes,
            mockFees: initialDataMock.application_state.fees,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockOrderTotal: 22099,
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22099,
                totalAmountDue: 2099,
                totalPaid: 20000,
                totalFees: 100,
                totalAdditionalFees: 0,
                totalTaxes: 10,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without line items array',
            mockLineItems: [],
            mockPayments: paymentsMock,
            mockTaxes: initialDataMock.application_state.taxes,
            mockFees: initialDataMock.application_state.fees,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockOrderTotal: 1999,
            mockTotals: {
                totalSubtotal: 0,
                totalOrder: 1999,
                totalAmountDue: -18001,
                totalPaid: 20000,
                totalFees: 0,
                totalAdditionalFees: 0,
                totalTaxes: 10,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without payments array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: [],
            mockTaxes: initialDataMock.application_state.taxes,
            mockFees: initialDataMock.application_state.fees,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockOrderTotal: 22099,
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22099,
                totalAmountDue: 22099,
                totalPaid: 0,
                totalFees: 100,
                totalAdditionalFees: 0,
                totalTaxes: 10,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without taxes array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: [],
            mockFees: initialDataMock.application_state.fees,
            mockDiscounts: initialDataMock.application_state.discounts,
            mockOrderTotal: 22089,
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22089,
                totalAmountDue: 2089,
                totalPaid: 20000,
                totalFees: 100,
                totalAdditionalFees: 0,
                totalTaxes: 0,
                totalDiscounts: 10
            }
        },
        {
            name: 'getTotals without discounts array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: initialDataMock.application_state.taxes,
            mockFees: initialDataMock.application_state.fees,
            mockDiscounts: [],
            mockOrderTotal: 22109,
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22109,
                totalAmountDue: 2109,
                totalPaid: 20000,
                totalFees: 100,
                totalAdditionalFees: 0,
                totalTaxes: 10,
                totalDiscounts: 0
            }
        },
        {
            name: 'getTotals with fees array',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: initialDataMock.application_state.taxes,
            mockFees: [feesMock],
            mockDiscounts: [],
            mockOrderTotal: 23309,
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 23309,
                totalAmountDue: 3309,
                totalPaid: 20000,
                totalFees: 100,
                totalAdditionalFees: 1200,
                totalTaxes: 10,
                totalDiscounts: 0
            }
        },
        {
            name: 'getTotals with undefined fees',
            mockLineItems: initialDataMock.application_state.line_items,
            mockPayments: initialDataMock.application_state.payments,
            mockTaxes: initialDataMock.application_state.taxes,
            mockFees: undefined,
            mockDiscounts: [],
            mockOrderTotal: 22109,
            mockTotals: {
                totalSubtotal: 20100,
                totalOrder: 22109,
                totalAmountDue: 2109,
                totalPaid: 20000,
                totalFees: 100,
                totalAdditionalFees: 0,
                totalTaxes: 10,
                totalDiscounts: 0
            }
        },
    ];

    test.each(dataProvider)(
        '$name',
        ({mockLineItems, mockPayments, mockTaxes, mockFees, mockDiscounts, mockOrderTotal, mockTotals}) => {
            const totals = getTotals(mockLineItems, mockPayments, mockTaxes, mockFees, mockDiscounts, mockOrderTotal);
            expect(totals).toStrictEqual(mockTotals);
        });
});
