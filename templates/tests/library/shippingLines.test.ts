import * as shippingLines from 'src/library';
import {baseReturnObject, getShippingLines} from '@bold-commerce/checkout-frontend-library';
import {stateMock} from 'src/mocks/stateMock';
import {actionSetLoader, actionSetButtonDisable} from 'src/action/appAction';
import {mocked} from 'jest-mock';
import {getSummaryStateFromLib} from 'src/library';
import {useSendEvent} from 'src/hooks';

jest.mock('@bold-commerce/checkout-frontend-library/lib/shipping');
jest.mock('src/action/appAction');
jest.mock('src/hooks/useSendEvent');
jest.mock('src/library/applicationState');
jest.mock('src/utils/handleErrorIfNeeded');
const actionSetLoaderMock = mocked(actionSetLoader, true);
const actionSetButtonDisableMock = mocked(actionSetButtonDisable, true);
const shippingLinesMock = mocked(getShippingLines, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);
const useSendEventMock = mocked(useSendEvent, true);

describe('testing shippingLines', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();
    const returnObject = {...baseReturnObject};

    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
    });

    test('tests calling get shipping lines', async  () => {
        const newReturnObj = {...returnObject, success: false};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(false);
        await getShippingLines(mockDispatch, getState);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).not.toHaveBeenCalled();
        expect(useSendEventMock).not.toHaveBeenCalled();
    });

    test('tests calling get shipping lines with a success', async () => {
        const newReturnObj = {...returnObject, success: true};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(false);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(5);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(2);
        expect(actionSetButtonDisableMock).toHaveBeenCalledTimes(1);
        expect(actionSetButtonDisableMock).toHaveBeenCalledWith('shippingPageButton', false);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });

    test('tests calling get shipping lines with an updated address and a success', async () => {
        const newReturnObj = {...returnObject, success: true};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(8);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(2);
        expect(actionSetButtonDisableMock).toHaveBeenCalledTimes(1);
        expect(actionSetButtonDisableMock).toHaveBeenCalledWith('shippingPageButton', false);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });

    test('tests calling get shipping lines with a success but empty shipping lines', async () => {
        const tempMock = {...stateMock};
        tempMock.data.application_state.shipping.available_shipping_lines = [];
        getState.mockReturnValue(tempMock);

        const newReturnObj = {...returnObject, success: true};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const getShippingLines = shippingLines.shippingLines(false);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(4);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(2);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });

    test('tests calling get shipping lines with a failure', async () => {
        const newReturnObj = {...returnObject, success: false};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(false);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(1);
        expect(actionSetButtonDisableMock).not.toHaveBeenCalled();
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(mockDispatch).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });
});
