import {mocked} from 'jest-mock';
import {getApplicationState} from '@boldcommerce/checkout-frontend-library';
import {onRequireOrderData} from 'src/eps';
import {initialDataMock} from 'src/mocks';
import {getTotals} from 'src/utils';
import {ITotals} from 'src/types';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/utils/getTotals');

const getApplicationStateMock = mocked(getApplicationState, true);
const getTotalsMock = mocked(getTotals, true);

describe('testing onRequireOrderData', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};
        getApplicationStateMock.mockReturnValue(initialDataMock.application_state);
        getTotalsMock.mockReturnValue(total);
    });

    test('testing onRequireOrderData with requirements', async () => {
        const dataPayload = await onRequireOrderData(['customer', 'items', 'billing_address', 'shipping_address', 'shipping_options', 'totals']);
        expect(dataPayload).toStrictEqual({
            customer: {
                first_name: 'John',
                last_name: 'Doe',
                email_address: 'john.doe@boldcommerce.com',
            },
            shipping_address: initialDataMock.application_state.addresses.shipping,
            shipping_options: [{
                label: 'USPS ground carrier',
                amount: 19.99,
                id: 'shipping_id_1',
                is_selected: true
            }],
            billing_address: initialDataMock.application_state.addresses.billing,
            totals: {
                order_total: 0,
                order_balance: 2999,
                shipping_total: 19.99,
                discounts_total: 0,
                fees_total: 0,
                taxes_total: 0
            },
            items: [{
                amount: 20000,
                label: '[Sample] Canvas Laundry Cart'
            }]
        });
    });
});