import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {
    actionSetAppStateValid,
    actionSetSelectedShippingLine
} from 'src/action/appAction';
import {
    getShippingFromLib,
    postShippingLines,
    setDefaultShippingLine,
} from 'src/library';
import {stateMock} from 'src/mocks';
import {IOrderInitialization} from 'src/types';

jest.mock('src/action/appAction');
const getShippingFromLibMock = mocked(getShippingFromLib, true);
const actionSetSelectedShippingLineMock = mocked(actionSetSelectedShippingLine, true);
const postShippingLinesMock = mocked(postShippingLines, true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);

describe('testing setDefaultShippingLine', () => {
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
    });

    test('set default shipping line', async () => {
        await setDefaultShippingLine(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetSelectedShippingLineMock).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(postShippingLinesMock);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
    });

    test('not set default shipping line', async () => {
        getState().data.application_state.shipping.available_shipping_lines = [];
        await setDefaultShippingLine(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetSelectedShippingLineMock).toHaveBeenCalledTimes(0);
        expect(dispatch).not.toHaveBeenCalledWith(postShippingLinesMock);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
    });
});
