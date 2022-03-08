import {mocked} from 'ts-jest/utils';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {
    callShippingPageApi,
    checkErrorAndProceedToNextPage,
    postShippingLines
} from 'src/library';

jest.mock('src/action');
jest.mock('src/library/checkErrorAndProceedToNextPage');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const checkErrorAndProceedToNextPageMock = mocked(checkErrorAndProceedToNextPage, true);

describe('testing callShippingLinesPageApi', () => {
    const dispatch = jest.fn();
    const checkErrorAndProceedToNextPageThunkMock = jest.fn();
    const actionSetLoaderAndDisableButtonThunkMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        checkErrorAndProceedToNextPageThunkMock.mockName('checkErrorAndProceedToNextPage');
        actionSetLoaderAndDisableButtonThunkMock.mockName('actionSetLoaderAndDisableButton');
        dispatch.mockReturnValue(Promise.resolve());
        checkErrorAndProceedToNextPageMock.mockReturnValue(checkErrorAndProceedToNextPageThunkMock);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonThunkMock);
    });

    test('success call to callShippingPageApi', async () => {
        const historyMock = {} as HistoryLocationState;

        const callShippingPageApiThunk = callShippingPageApi(historyMock);
        await callShippingPageApiThunk(dispatch).then(() => {
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('shippingPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(postShippingLines);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('/payment', 'shippingPageButton', historyMock);
        });
    });
});
