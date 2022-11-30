import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {returnToPageOnError} from 'src/library';
import {stateMock} from 'src/mocks';
import {getCheckoutUrl} from 'src/utils';

jest.mock('src/action');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);

describe('testing returnToPageOnError', () => {
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
    });

    test('call without errors on state', async () => {
        const noErrorsState = {...stateMock, errors: []};
        getState.mockReturnValueOnce(noErrorsState);

        const returnToPageOnErrorThunk = returnToPageOnError(page, loaderName, historyMock);
        await returnToPageOnErrorThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(0);
            expect(historyMock.replace).not.toHaveBeenCalledWith(getCheckoutUrl(page));
        });
    });

    test('call with errors on state', async () => {
        const returnToPageOnErrorThunk = returnToPageOnError(page, loaderName, historyMock);
        await returnToPageOnErrorThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith(loaderName, false);
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(page));
        });
    });
});
