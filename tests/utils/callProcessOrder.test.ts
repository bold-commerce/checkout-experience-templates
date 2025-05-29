import {mocked} from 'jest-mock';
import {callProcessOrder} from 'src/utils';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {ITotals} from 'src/types';
import {actionClearErrors} from 'src/action';
import {ILifeField, IPayment} from '@boldcommerce/checkout-frontend-library';
import {useGetPayments} from 'src/hooks';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/library');
jest.mock('src/hooks/useGetPayments');

const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const processOrderMock = mocked(processOrder, true);
const useGetPaymentsMock = mocked(useGetPayments, true);

describe('Testing callProcessOrder function', () => {
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()};
    const processOrderThunkMock = jest.fn();

    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        }
    ];

    const paymentsMock: Array<IPayment> = [
        {
            gateway_public_id: '1234',
            amount: 2999,
            currency: 'CAD',
            type: 'Crypto',
            display_string: '',
            id: '1234',
            token: 'token',
            retain: false,
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
        useDispatchMock.mockReturnValue(dispatchMock);
        useHistoryMock.mockReturnValue(historyMock);
        processOrderMock.mockReturnValue(processOrderThunkMock);
        useGetPaymentsMock.mockReturnValue(paymentsMock);
    });

    test('Render the function with amount remaining', async () => {

        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};
        callProcessOrder(dispatchMock, total, historyMock, lifeFields);
        await Promise.resolve();

        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('Render the function with no amount remaining', async () => {
        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:2999, totalDiscounts:0, totalAmountDue:0};

        callProcessOrder(dispatchMock, total, historyMock, lifeFields);
        await Promise.resolve();

        expect(dispatchMock).toHaveBeenCalledTimes(4);
        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
    });
});
