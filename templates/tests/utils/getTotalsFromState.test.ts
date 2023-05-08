import {mocked} from 'jest-mock';
import {
    useGetDiscounts,
    useGetFees,
    useGetLineItems,
    useGetOrderTotal,
    useGetPayments,
    useGetTaxes
} from 'src/hooks';
import {stateMock} from 'src/mocks';
import {getTotals, getTotalsFromState} from 'src/utils';
import {ITotals} from 'src/types';
import {IFees} from '@boldcommerce/checkout-frontend-library';


jest.mock('src/hooks');
jest.mock('src/utils/getTotals');

const useGetDiscountsMock = mocked(useGetDiscounts, true);
const useGetPaymentsMock = mocked(useGetPayments, true);
const useGetTaxesMock = mocked(useGetTaxes, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const useGetFeesMock = mocked(useGetFees, true);
const useGetOrderTotalMock = mocked(useGetOrderTotal, true);
const getTotalsMock = mocked(getTotals, true);


describe('Testing getTotalsFromState function', () => {

    const appState = stateMock.data.application_state;
    const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

    beforeEach(() => {
        useGetTaxesMock.mockReturnValue(appState.taxes);
        useGetLineItemsMock.mockReturnValue(appState.line_items);
        useGetDiscountsMock.mockReturnValue(appState.discounts);
        useGetPaymentsMock.mockReturnValue(appState.payments);
        useGetOrderTotalMock.mockReturnValue(appState.order_total);
        getTotalsMock.mockReturnValue(total);
        useGetFeesMock.mockReturnValue(appState.fees as Array<IFees>);
    });

    test('rendering the function', () => {
        const result = getTotalsFromState();
        expect(result).toBe(total);
        expect(getTotalsMock).toHaveBeenCalledTimes(1);
        expect(useGetDiscountsMock).toHaveBeenCalledTimes(1);
        expect(useGetPaymentsMock).toHaveBeenCalledTimes(1);
        expect(useGetTaxesMock).toHaveBeenCalledTimes(1);
        expect(useGetLineItemsMock).toHaveBeenCalledTimes(1);
        expect(useGetOrderTotalMock).toHaveBeenCalledTimes(1);
    });
});
