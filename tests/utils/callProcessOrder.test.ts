import {mocked} from 'jest-mock';
import {callProcessOrder} from 'src/utils';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {ITotals} from 'src/types';
import {actionAddError, actionClearErrors} from 'src/action';
import {
    sendAddPaymentActionAsync,
    sendRefreshOrderActionAsync
} from '@boldcommerce/checkout-frontend-library/lib/pigi';
import {IApiErrorResponse, IFetchError, IPigiResponseType} from '@boldcommerce/checkout-frontend-library';
import {pigiActionTypes} from '@boldcommerce/checkout-frontend-library/lib/variables/constants';

jest.mock('@boldcommerce/checkout-frontend-library/lib/pigi');
jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/library');

const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const processOrderMock = mocked(processOrder, true);
const sendRefreshOrderActionAsyncMock = mocked(sendRefreshOrderActionAsync, true);
const sendAddPaymentActionAsyncMock = mocked(sendAddPaymentActionAsync, true);


describe('Testing callProcessOrder function', () => {
    const pageNameWithPrefix = 'prefix_page_name';
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()};
    const processOrderThunkMock = jest.fn();
    const rejectedValue: IFetchError = {
        status: 1000,
        statusText: undefined,
        body: undefined,
        metaData: undefined,
        name: 'FetchError',
        message: 'There has been an error fetching'
    };
    const resolvedRefreshValue: IPigiResponseType = {
        responseType: pigiActionTypes.PIGI_REFRESH_ORDER,
        payload: { key: 'value' }
    };
    const resolvedPaymentValue: IPigiResponseType = {
        responseType: pigiActionTypes.PIGI_ADD_PAYMENT,
        payload: { key: 'value' }
    };

    const convertedFetchError: IApiErrorResponse = {
        message: '',
        type: 'api',
        field: '',
        severity: 'critical',
        sub_type: ''
    }

    beforeEach(() => {
        jest.resetAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
        useDispatchMock.mockReturnValue(dispatchMock);
        useHistoryMock.mockReturnValue(historyMock);
        processOrderMock.mockReturnValue(processOrderThunkMock);
        sendRefreshOrderActionAsyncMock.mockResolvedValue(resolvedRefreshValue);
        sendAddPaymentActionAsyncMock.mockResolvedValue(resolvedPaymentValue);
    });

    test('Render the function with amount remaining', async () => {

        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};
        callProcessOrder(dispatchMock, total, historyMock);
        await Promise.resolve();

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(1);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('testing if refreshing order action rejected promise', async () => {
        sendRefreshOrderActionAsyncMock.mockRejectedValue(rejectedValue);
        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

        callProcessOrder(dispatchMock, total, historyMock);
        await Promise.resolve();

        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(dispatchMock).toHaveBeenCalledWith(actionAddError(convertedFetchError));
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(1);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('Render the function with no amount remaining', async () => {
        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:2999, totalDiscounts:0, totalAmountDue:0};

        callProcessOrder(dispatchMock, total, historyMock);
        await Promise.resolve();

        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
    });

});
