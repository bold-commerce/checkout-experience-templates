import {mocked} from 'jest-mock';
import {validateShippingLine} from 'src/library';
import {stateMock} from 'src/mocks/stateMock';
import {actionAddError, actionRemoveErrorByType, actionSetAppStateValid} from 'src/action';
import {errorTypes} from 'src/constants';
import {IShippingLine} from "@boldcommerce/checkout-frontend-library";

jest.mock('src/action');
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);
const actionAddErrorMock = mocked(actionAddError, true);
const actionRemoveErrorByTypeMock = mocked(actionRemoveErrorByType, true);

describe('testing validateShippingLine', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        getState.mockReturnValue(stateMock);
    });

    test('calling validate shipping line with getState returning undefined', async () => {
        getState.mockReturnValueOnce(undefined);

        await validateShippingLine(dispatch, getState).catch((error) => {
            expect(error).toBeTruthy();
        });
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actionRemoveErrorByTypeMock).toHaveBeenCalledTimes(0);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate shipping line with getState returning a different data structure', async () => {
        getState.mockReturnValueOnce([]);

        await validateShippingLine(dispatch, getState).catch((error) => {
            expect(error).toBeTruthy();
        });
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actionRemoveErrorByTypeMock).toHaveBeenCalledTimes(0);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate shipping line with success true', async () => {
        getState.mockReturnValueOnce(stateMock);

        await validateShippingLine(dispatch, getState).then(() => {
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(actionRemoveErrorByTypeMock).toHaveBeenCalledTimes(1);
            expect(actionRemoveErrorByTypeMock).toHaveBeenCalledWith(errorTypes.shipping_line);
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingLine', true);
            expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
        });
    });

    test('calling validate shipping line with success false', async () => {
        const newMock = {...stateMock};
        newMock.data.application_state.shipping.selected_shipping.id = '';
        getState.mockReturnValueOnce(newMock);

        await validateShippingLine(dispatch, getState).then(() => {
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(actionRemoveErrorByTypeMock).toHaveBeenCalledTimes(1);
            expect(actionRemoveErrorByTypeMock).toHaveBeenCalledWith(errorTypes.shipping_line);
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingLine', false);
            expect(actionAddErrorMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling validate shipping line with success false empty object', async () => {
        const newMock = {...stateMock};
        newMock.data.application_state.shipping.selected_shipping = {} as IShippingLine;
        getState.mockReturnValueOnce(newMock);

        await validateShippingLine(dispatch, getState).then(() => {
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(actionRemoveErrorByTypeMock).toHaveBeenCalledTimes(1);
            expect(actionRemoveErrorByTypeMock).toHaveBeenCalledWith(errorTypes.shipping_line);
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingLine', false);
            expect(actionAddErrorMock).toHaveBeenCalledTimes(1);
        });
    });

});
