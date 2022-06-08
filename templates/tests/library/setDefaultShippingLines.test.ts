import {baseReturnObject, getShippingLines} from '@bold-commerce/checkout-frontend-library';
import {actionSetSelectedShippingLine} from 'src/action';
import {getShippingFromLib, postShippingLines, setDefaultShippingLines, validateShippingLine} from 'src/library';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';

jest.mock('@bold-commerce/checkout-frontend-library/lib/shipping');
const shippingLinesMock = mocked(getShippingLines, true);

describe('Testing hook useSetDefaultShippingLines', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const returnObject = {...baseReturnObject};

    beforeEach(() => {
        dispatch.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('set default shipping lines properly', async () => {
        const newReturnObj = {...returnObject, success: true};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const tempMock = {
            ...stateMock,
            isValid: {
                updatedShippingAddress: true
            }
        };
        getState.mockReturnValue(tempMock);

        await setDefaultShippingLines(dispatch, getState);

        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch).toHaveBeenCalledWith(getShippingFromLib);
        expect(dispatch).toHaveBeenCalledWith(actionSetSelectedShippingLine(stateMock.data.application_state.shipping.available_shipping_lines[0]));
        expect(dispatch).toHaveBeenCalledWith(validateShippingLine);
        expect(dispatch).toHaveBeenCalledWith(postShippingLines);
    });

    test('set default shipping lines invalid shipping address', async () => {
        const tempMock = {
            ...stateMock,
            isValid: {
                updatedShippingAddress: false
            }
        };
        getState.mockReturnValue(tempMock);

        await setDefaultShippingLines(dispatch, getState);

        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    test('set default shipping lines failed api call', async () => {
        const newReturnObj = {...returnObject, success: false};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const tempMock = {
            ...stateMock,
            isValid: {
                updatedShippingAddress: true
            }
        };
        getState.mockReturnValue(tempMock);

        await setDefaultShippingLines(dispatch, getState);

        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    test('set default shipping lines no available shipping lines', async () => {
        const newReturnObj = {...returnObject, success: true};
        shippingLinesMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const tempMock = {
            ...stateMock,
            data: {
                ...stateMock.data,
                application_state: {
                    ...stateMock.data.application_state,
                    shipping: {
                        ...stateMock.data.application_state.shipping,
                        available_shipping_lines: []
                    }
                }
            },
            isValid: {
                ...stateMock.isValid,
                updatedShippingAddress: true
            },

        };
        getState.mockReturnValue(tempMock);

        await setDefaultShippingLines(dispatch, getState);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(getShippingFromLib);
    });
});
