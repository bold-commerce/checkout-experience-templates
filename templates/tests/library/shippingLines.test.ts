import * as shippingLines from 'src/library';
import {getShippingLines} from '@bold-commerce/checkout-frontend-library';
import {stateMock} from 'src/mocks/stateMock';
import * as actionSetLoader from 'src/action/appAction';
import {mocked} from 'ts-jest/utils';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import {getSummaryStateFromLib, postShippingLines} from 'src/library';
import {useSendEvent} from 'src/hooks';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/library/applicationState');
jest.mock('src/hooks/useSendEvent');
const shippingLinesMock = mocked(getShippingLines, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);
const useSendEventMock = mocked(useSendEvent, true);

describe('testing shippingLines', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();
    const returnObject = {...baseReturnObject};
    let setLoaderSpy: jest.SpyInstance;
    let setButtonDisableSpy: jest.SpyInstance;
    let handleErrorSpy:jest.SpyInstance;

    beforeEach(() => {
        mockDispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);

        handleErrorSpy = jest.spyOn(handleErrorIfNeeded, 'handleErrorIfNeeded').mockImplementation();
        setLoaderSpy = jest.spyOn(actionSetLoader, 'actionSetLoader');
        setButtonDisableSpy = jest.spyOn(actionSetLoader, 'actionSetButtonDisable');
    });

    afterEach(() => {
        jest.resetAllMocks();
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
        expect(setLoaderSpy).toHaveBeenCalledTimes(2);
        expect(setButtonDisableSpy).toHaveBeenCalledTimes(1);
        expect(setButtonDisableSpy).toHaveBeenCalledWith('shippingPageButton', false);
        expect(setLoaderSpy).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });

    test('tests calling get shipping lines with an updated address and a success', async () => {
        const newReturnObj = {...returnObject, success: true};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(8);
        expect(setLoaderSpy).toHaveBeenCalledTimes(2);
        expect(setButtonDisableSpy).toHaveBeenCalledTimes(1);
        expect(setButtonDisableSpy).toHaveBeenCalledWith('shippingPageButton', false);
        expect(setLoaderSpy).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
        expect(mockDispatch).toHaveBeenCalledWith(postShippingLines);
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
        expect(setLoaderSpy).toHaveBeenCalledTimes(2);
        expect(setLoaderSpy).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });

    test('tests calling get shipping lines with a failure', async () => {
        const newReturnObj = {...returnObject, success: false};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(false);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(setLoaderSpy).toHaveBeenCalledTimes(1);
        expect(setButtonDisableSpy).not.toHaveBeenCalled();
        expect(setLoaderSpy).toHaveBeenCalledWith('shippingLines', true);
        expect(mockDispatch).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
    });
});
