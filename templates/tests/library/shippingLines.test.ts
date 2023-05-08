import * as shippingLines from 'src/library';
import { baseReturnObject, getShippingLines } from '@boldcommerce/checkout-frontend-library';
import { stateMock } from 'src/mocks';
import { actionSetLoader, actionSetButtonDisable, actionSetSelectedShippingLine, actionSetAppStateValid } from 'src/action/appAction';
import { mocked } from 'jest-mock';
import {generateTaxes, getShippingFromLib, getSummaryStateFromLib, postShippingLines} from 'src/library';
import { useSendEvent } from 'src/hooks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('src/action/appAction');
jest.mock('src/hooks/useSendEvent');
jest.mock('src/library/applicationState');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/library/generateTaxes');
const actionSetLoaderMock = mocked(actionSetLoader, true);
const actionSetButtonDisableMock = mocked(actionSetButtonDisable, true);
const shippingLinesMock = mocked(getShippingLines, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);
const getShippingFromLibMock = mocked(getShippingFromLib, true);
const postShippingLinesMock = mocked(postShippingLines, true);
const useSendEventMock = mocked(useSendEvent, true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);
const generateTaxesMock = mocked(generateTaxes, true);
describe('testing shippingLines', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();
    const returnObject = { ...baseReturnObject };

    const shippingData = [
        {
            type: 'Has no available shipping lines and no selected shipping',
            available_shipping_lines: [],
            selected_shipping: {
                id: '',
                description: '',
                amount: 0
            }
        },
        {
            type: 'Has available shipping lines and no selected shipping',
            available_shipping_lines: [{
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 19.99
            },
            {
                id: 'shipping_id_2',
                description: 'USPS express carrier',
                amount: 25.99
            }],
            selected_shipping: {
                id: '',
                description: '',
                amount: 0
            }
        },
        {
            type: 'Has available shipping lines and selected shipping',
            available_shipping_lines: [{
                id: 'shipping_id_1',
                description: 'USPS ground carrier',
                amount: 19.99
            },
            {
                id: 'shipping_id_2',
                description: 'USPS express carrier',
                amount: 25.99
            }],
            selected_shipping: {
                id: 'shipping_id_2',
                description: 'USPS express carrier',
                amount: 25.99
            }
        },

    ]


    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
    });

    test('tests calling get shipping lines with no success', async () => {
        const newReturnObj = { ...returnObject, success: false };
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);

        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).not.toHaveBeenCalled();
        expect(useSendEventMock).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith(generateTaxesMock);

    });

    test('tests calling get shipping lines with a failure', async () => {
        const newReturnObj = { ...returnObject, success: false };
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(false);
        await getShippingLines(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(actionSetLoaderMock).toHaveBeenCalledTimes(1);
        expect(actionSetButtonDisableMock).not.toHaveBeenCalled();
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(getState).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
        expect(mockDispatch).not.toHaveBeenCalledWith(generateTaxesMock);
    });


    test('tests calling get shipping lines with a success', async () => {
        const newReturnObj = { ...returnObject, success: true };
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);

        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalled();
        expect(useSendEventMock).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
        expect(mockDispatch).toHaveBeenCalledWith(generateTaxesMock);
    });


    test('tests calling get shipping lines with a success and available shipping lines', async () => {
        const newReturnObj = { ...returnObject, success: true };
        const tempMock = { ...stateMock };
        const availableShippingLines = shippingData[1].available_shipping_lines
        const selectedShipping = shippingData[1].selected_shipping

        tempMock.data.application_state.shipping.available_shipping_lines = availableShippingLines;
        tempMock.data.application_state.shipping.selected_shipping = selectedShipping;

        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);

        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalled();
        expect(useSendEventMock).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
        expect(generateTaxesMock).not.toHaveBeenCalled();

        expect(actionSetButtonDisableMock).toHaveBeenCalledWith('shippingPageButton', false);
    });


    test('tests calling get shipping lines with a success and available shipping lines and updated address', async () => {
        const newReturnObj = { ...returnObject, success: true };
        const tempMock = { ...stateMock };
        const availableShippingLines = shippingData[1].available_shipping_lines
        const selectedShipping = shippingData[1].selected_shipping

        tempMock.data.application_state.shipping.available_shipping_lines = availableShippingLines;
        tempMock.data.application_state.shipping.selected_shipping = selectedShipping;

        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);

        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalled();
        expect(useSendEventMock).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
        expect(mockDispatch).toHaveBeenCalledWith(generateTaxesMock);

        expect(actionSetButtonDisableMock).toHaveBeenCalledWith('shippingPageButton', false);

        expect(actionSetSelectedShippingLine).toHaveBeenCalledWith(availableShippingLines[0]);
        expect(mockDispatch).toHaveBeenCalledWith(postShippingLinesMock);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('updatedShippingAddress', false);
    });

    test('tests calling get shipping lines with a success and available shipping lines and updated address and selected shipping', async () => {
        const newReturnObj = { ...returnObject, success: true };
        const tempMock = { ...stateMock };
        const availableShippingLines = shippingData[2].available_shipping_lines
        const selectedShipping = shippingData[2].selected_shipping

        tempMock.data.application_state.shipping.available_shipping_lines = availableShippingLines;
        tempMock.data.application_state.shipping.selected_shipping = selectedShipping;

        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);

        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalled();
        expect(useSendEventMock).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
        expect(mockDispatch).toHaveBeenCalledWith(generateTaxesMock);

        expect(mockDispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);

        expect(actionSetButtonDisableMock).toHaveBeenCalledWith('shippingPageButton', false);

        expect(actionSetSelectedShippingLine).toHaveBeenCalledWith(selectedShipping);
        expect(mockDispatch).toHaveBeenCalledWith(postShippingLinesMock);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('updatedShippingAddress', false);
    });

    test('tests calling get shipping lines with a success but empty shipping lines', async () => {
        const newReturnObj = { ...returnObject, success: true };
        const tempMock = { ...stateMock };
        const availableShippingLines = shippingData[0].available_shipping_lines

        tempMock.data.application_state.shipping.available_shipping_lines = availableShippingLines;

        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getShippingLines = shippingLines.shippingLines(true);
        await getShippingLines(mockDispatch, getState);

        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', true);
        expect(shippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getState).toHaveBeenCalled();
        expect(useSendEventMock).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(generateTaxesMock);
        expect(mockDispatch).toHaveBeenCalledWith(getShippingFromLibMock);
        expect(actionSetLoaderMock).toHaveBeenCalledWith('shippingLines', false);
    });

});
