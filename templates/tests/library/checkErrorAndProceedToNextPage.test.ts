import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {checkErrorAndProceedToNextPage} from 'src/library';
import {stateMock} from 'src/mocks';
import {getCheckoutUrl, isOnlyDiscountCodeError} from 'src/utils';
import {orderCompleteAnalytics} from 'src/analytics';

jest.mock('src/action');
jest.mock('src/utils');
jest.mock('src/analytics');
jest.mock('src/hooks');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const isOnlyDiscountCodeErrorMock = mocked(isOnlyDiscountCodeError, true);
const orderCompleteAnalyticsMock = mocked(orderCompleteAnalytics, true);

describe('testing checkErrorAndProceedToNextPage', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const actionSetLoaderAndDisableButtonThunkMock = jest.fn();
    const historyMock = {replace: jest.fn()} as HistoryLocationState;
    const page = '/testPage';
    const loaderName = 'testLoader';

    beforeEach(() => {
        jest.resetAllMocks();
        window.shopAlias = 'test';
        window.platformType = 'shopify';
        dispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonThunkMock);
        isOnlyDiscountCodeErrorMock.mockReturnValue(false);
    });

    test('call without errors on state', async () => {
        const noErrorsState = {...stateMock, errors: []};
        getState.mockReturnValueOnce(noErrorsState);

        const checkErrorAndProceedToNextPageThunk = checkErrorAndProceedToNextPage(page, loaderName, historyMock);
        await checkErrorAndProceedToNextPageThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(page));
        });
    });

    test('call with errors on state', async () => {
        const checkErrorAndProceedToNextPageThunk = checkErrorAndProceedToNextPage(page, loaderName, historyMock);
        await checkErrorAndProceedToNextPageThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(0);
            expect(historyMock.replace).not.toHaveBeenCalledWith(page);
        });
    });

    test('testing callOrderCompleteAnalytics', async () => {
        const noErrorsState = {...stateMock, errors: []};
        getState.mockReturnValueOnce(noErrorsState);

        const checkErrorAndProceedToNextPageThunk = checkErrorAndProceedToNextPage(page, loaderName, historyMock, true);
        await checkErrorAndProceedToNextPageThunk(dispatch, getState).then(() => {
            expect(orderCompleteAnalyticsMock).toHaveBeenCalledTimes(1);
        });
    });

    test('call with only 1 discount error on state', async () => {
        const onlyDiscountErrorsState = {...stateMock, errors: [
            {
                address_type: '',
                field: 'code',
                message: 'The code field is required.',
                severity: 'validation',
                sub_type: '',
                type: 'authorization',
            }
        ]};
        getState.mockReturnValueOnce(onlyDiscountErrorsState);
        isOnlyDiscountCodeErrorMock.mockReturnValueOnce(true);

        const checkErrorAndProceedToNextPageThunk = checkErrorAndProceedToNextPage(page, loaderName, historyMock);
        await checkErrorAndProceedToNextPageThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(isOnlyDiscountCodeErrorMock).toHaveBeenCalledTimes(1);
            expect(isOnlyDiscountCodeErrorMock).toHaveBeenCalledWith(onlyDiscountErrorsState.errors);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(page));
        });
    });

    test('call with only 1 discount error - new format - on state', async () => {
        const onlyDiscountErrorsState = {...stateMock, errors: [
            {
                code: '02',
                message: 'Some error message',
                type: 'discount_code.discount_validation',
            }
        ]};
        getState.mockReturnValueOnce(onlyDiscountErrorsState);
        isOnlyDiscountCodeErrorMock.mockReturnValueOnce(true);

        const checkErrorAndProceedToNextPageThunk = checkErrorAndProceedToNextPage(page, loaderName, historyMock);
        await checkErrorAndProceedToNextPageThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(isOnlyDiscountCodeErrorMock).toHaveBeenCalledTimes(1);
            expect(isOnlyDiscountCodeErrorMock).toHaveBeenCalledWith(onlyDiscountErrorsState.errors);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(page));
        });
    });

    test('call with only 1 discount error on state', async () => {
        const onlyDiscountErrorsState = {...stateMock, errors: [
            {
                address_type: '',
                field: 'code',
                message: 'The code field is required.',
                severity: 'validation',
                sub_type: '',
                type: 'authorization',
            }
        ]};
        getState.mockReturnValueOnce(onlyDiscountErrorsState);
        isOnlyDiscountCodeErrorMock.mockReturnValueOnce(true);

        const checkErrorAndProceedToNextPageThunk = checkErrorAndProceedToNextPage(page, loaderName, historyMock);
        await checkErrorAndProceedToNextPageThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(isOnlyDiscountCodeErrorMock).toHaveBeenCalledTimes(1);
            expect(isOnlyDiscountCodeErrorMock).toHaveBeenCalledWith(onlyDiscountErrorsState.errors);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(page));
        });
    });

});
