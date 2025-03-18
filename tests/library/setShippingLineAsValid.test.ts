import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {actionSetAppStateValid, actionSetButtonDisable, actionSetLoader} from 'src/action/appAction';
import {getSummaryStateFromLib, setShippingLineAsValid} from 'src/library';
import {stateMock} from 'src/mocks';
import {IOrderInitialization} from 'src/types';

jest.mock('src/action/appAction');
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);
const actionSetButtonDisableMock = mocked(actionSetButtonDisable, true);
const actionSetLoaderMock = mocked(actionSetLoader, true);

describe('testing setShippingLineAsValid', () => {
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
    });

    test('set shipping line as valid if there are available shipping lines', async () => {
        await setShippingLineAsValid(dispatch, getState);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(actionSetButtonDisableMock).toHaveBeenCalledTimes(1);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });

    test('not set shipping line as valid if there are no available shipping lines', async () => {
        getState().data.application_state.shipping.available_shipping_lines = [];
        await setShippingLineAsValid(dispatch, getState);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
        expect(actionSetButtonDisableMock).toHaveBeenCalledTimes(0);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(0);
        expect(dispatch).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });
});
