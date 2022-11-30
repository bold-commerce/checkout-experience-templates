import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {
    callShippingLinesPageApi,
    checkErrorAndProceedToNextPage,
    postShippingLines,
    validateShippingLine
} from 'src/library';
import {stateMock} from 'src/mocks';

jest.mock('src/action');
jest.mock('src/library/checkErrorAndProceedToNextPage');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const checkErrorAndProceedToNextPageMock = mocked(checkErrorAndProceedToNextPage, true);

describe('testing callShippingLinesPageApi', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const checkErrorAndProceedToNextPageThunkMock = jest.fn();
    const actionSetLoaderAndDisableButtonThunkMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        getState.mockReturnValue(stateMock);
        checkErrorAndProceedToNextPageThunkMock.mockName('checkErrorAndProceedToNextPage');
        actionSetLoaderAndDisableButtonThunkMock.mockName('actionSetLoaderAndDisableButton');
        dispatch.mockReturnValue(Promise.resolve());
        checkErrorAndProceedToNextPageMock.mockReturnValue(checkErrorAndProceedToNextPageThunkMock);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonThunkMock);
    });

    test('success call to callShippingLinesPageApi', async () => {
        const historyMock = {} as HistoryLocationState;

        const callShippingLinesPageApiThunk = callShippingLinesPageApi(historyMock);
        await callShippingLinesPageApiThunk(dispatch).then(() => {
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('shippingPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(4);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(validateShippingLine);
            expect(dispatch).toHaveBeenCalledWith(postShippingLines);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('payment', 'shippingPageButton', historyMock, false);
        });
    });
});
