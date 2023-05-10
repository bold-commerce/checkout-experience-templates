import {baseReturnObject, changeShippingLine, getShipping, IShipping, IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {generateTaxes, getSummaryStateFromLib, postShippingLines} from 'src/library';
import {handleErrorIfNeeded} from 'src/utils';
import {actionSetLoaderAndDisableButton} from 'src/action';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/library/applicationState');
jest.mock('src/action');
jest.mock('src/library/generateTaxes');
const setShippingLinesMock = mocked(changeShippingLine, true);
const getShippingMock = mocked(getShipping, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const generateTaxesMock = mocked(generateTaxes, true);

describe('testing postShippingLines', () => {

    const returnObject = {...baseReturnObject};
    const dispatch = jest.fn();
    const getState = jest.fn();
    const fakeInvalidData = {something: 'different'};
    const fakeShippingLine1: IShippingLine = {
        id: '0',
        description: 'fakeDescription1',
        amount: 100
    };
    const fakeShippingLine2: IShippingLine = {
        id: '1',
        description: 'fakeDescription2',
        amount: 100
    };
    const fakeShipping: IShipping = {
        selected_shipping: fakeShippingLine1,
        available_shipping_lines: [fakeShippingLine1, fakeShippingLine2],
        taxes: [],
        discounts: []
    };
    const actionSetLoaderAndDisableButtonFunctionMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        actionSetLoaderAndDisableButtonFunctionMock.mockName('actionSetLoaderAndDisableButton');
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonFunctionMock);
    });

    test('calling post shipping lines endpoint with getState returning undefined', async () => {
        getState.mockReturnValueOnce(undefined);
        const expectedError = new TypeError("Cannot destructure property `data` of 'undefined' or 'null'.");
        await postShippingLines(dispatch, getState).catch((error) => {
            expect(error).toStrictEqual(expectedError);
        });
        expect(setShippingLinesMock).toHaveBeenCalledTimes(0);
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(0);
        expect(dispatch).not.toHaveBeenCalledWith(generateTaxesMock);
    });

    test('calling post shipping lines endpoint with getState returning a different data structure', async () => {
        getState.mockReturnValueOnce(fakeInvalidData);
        const expectedError = new TypeError("Cannot destructure property `application_state` of 'undefined' or 'null'.");
        await postShippingLines(dispatch, getState).catch((error) => {
            expect(error).toStrictEqual(expectedError);
        });
        expect(setShippingLinesMock).toHaveBeenCalledTimes(0);
        expect(dispatch).not.toHaveBeenCalledWith(generateTaxesMock);
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(0);
    });

    test('calling post shipping lines with same lines and checking that they don\'t switch', async () => {
        returnObject.success = true;
        getShippingMock.mockReturnValueOnce(fakeShipping);
        stateMock.data.application_state.shipping.selected_shipping.id = fakeShippingLine1.id;

        await postShippingLines(dispatch, getState).then(() => {
            expect(setShippingLinesMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling post shipping lines with different lines and checking that they switch', async () => {
        returnObject.success = true;
        getShippingMock.mockReturnValueOnce(fakeShipping);
        stateMock.data.application_state.shipping.selected_shipping.id = fakeShippingLine2.id;

        await postShippingLines(dispatch, getState).then(() => {
            expect(setShippingLinesMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(getSummaryStateFromLibMock);
            expect(dispatch).toHaveBeenCalledWith(generateTaxesMock);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling with same for previous and current selected shipping line', async () => {
        returnObject.success = true;
        getShippingMock.mockReturnValueOnce(stateMock.data.application_state.shipping);

        await postShippingLines(dispatch, getState).then(() => {
            expect(setShippingLinesMock).toHaveBeenCalledTimes(0);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
            expect(dispatch).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
            expect(dispatch).not.toHaveBeenCalledWith(generateTaxesMock);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
        });
    });
});
