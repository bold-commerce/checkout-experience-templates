import {
    baseReturnObject,
    getShippingAddress,
    setShippingAddress,
    updateShippingAddress
} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {actionSetAppStateValid, SET_VALID} from 'src/action';
import {defaultAddressState} from 'src/constants';
import {postShippingAddress, setShippingAddressAsValid} from 'src/library';
import {stateMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';
import {AnyAction} from 'redux';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('@bold-commerce/checkout-frontend-library/lib/address');
jest.mock('src/action');
jest.mock('src/utils/handleErrorIfNeeded');
const updateShippingAddressMock = mocked(updateShippingAddress, true);
const setShippingAddressMock = mocked(setShippingAddress, true);
const getAddressesMock = mocked(getShippingAddress, true);
const handleErrorMock = mocked(handleErrorIfNeeded, true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);

describe('testing postAddress', () => {
    const successReturnObject = {...baseReturnObject, success: true};
    const dispatch = jest.fn();
    const getState = jest.fn();
    const fakeInvalidData = {something: 'different'};
    const actionReturnMock: AnyAction = {type: SET_VALID};

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        setShippingAddressMock.mockReturnValue(successReturnObject);
        updateShippingAddressMock.mockReturnValue(successReturnObject);
        actionSetAppStateValidMock.mockReturnValue(actionReturnMock);
        getAddressesMock.mockReturnValue(stateMock.data.application_state.addresses.shipping);
    });

    test('calling post shipping address endpoint with getState returning undefined', async () => {
        getState.mockReturnValueOnce(undefined);
        const expectedError = new TypeError("Cannot destructure property `data` of 'undefined' or 'null'.");
        await postShippingAddress(dispatch, getState).catch((error) => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(error).toStrictEqual(expectedError);
        });
    });

    test('calling post shipping address endpoint with getState returning a different data structure', async () => {
        getState.mockReturnValueOnce(fakeInvalidData);
        const expectedError = new TypeError("Cannot destructure property `application_state` of 'undefined' or 'null'.");
        await postShippingAddress(dispatch, getState).catch((error) => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(error).toStrictEqual(expectedError);
        });
    });

    test('calling post shipping address when previous is equal default address', async () => {
        const newStateMock = {data: {application_state: {addresses: {shipping: defaultAddressState}}}};
        getState.mockReturnValueOnce(newStateMock);
        getAddressesMock.mockReturnValueOnce(defaultAddressState);

        await postShippingAddress(dispatch, getState).then(() => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(setShippingAddressMock).toHaveBeenCalledWith(defaultAddressState);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledWith(setShippingAddressAsValid);
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(handleErrorMock).toHaveBeenCalledWith(successReturnObject, dispatch, getState, 'shipping');
        });
    });

    test('calling post shipping address when previous is different id from new address', async () => {
        const previous = {...defaultAddressState, id: '0'};
        const address = {...defaultAddressState, id: '1'};
        const newStateMock = {data: {application_state: {addresses: {shipping: address}}}};
        getState.mockReturnValueOnce(newStateMock);
        getAddressesMock.mockReturnValue(previous);


        await postShippingAddress(dispatch, getState).then(() => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(setShippingAddressMock).toHaveBeenCalledWith(address);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledWith(setShippingAddressAsValid);
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(handleErrorMock).toHaveBeenCalledWith(successReturnObject, dispatch, getState, 'shipping');
        });
    });

    test('calling put shipping address when previous is same id but with changes', async () => {
        const previous = {...defaultAddressState, id: '1'};
        const address = {...defaultAddressState, id: '1', address_line_1: 'test_address'};
        const newStateMock = {data: {application_state: {addresses: {shipping: address}}}};
        getState.mockReturnValueOnce(newStateMock);
        getAddressesMock.mockReturnValue(previous);

        await postShippingAddress(dispatch, getState).then(() => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(updateShippingAddressMock).toHaveBeenCalledWith(address);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledWith(setShippingAddressAsValid);
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(handleErrorMock).toHaveBeenCalledWith(successReturnObject, dispatch, getState, 'shipping');
        });
    });

    test('calling put shipping address when previous is different from new address', async () => {
        const address = {...defaultAddressState, address_line_1: 'test_address'};
        getAddressesMock.mockReturnValueOnce({shipping: address});

        await postShippingAddress(dispatch, getState).then(() => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(updateShippingAddressMock).toHaveBeenCalledWith(stateMock.data.application_state.addresses.shipping);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledWith(setShippingAddressAsValid);
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(handleErrorMock).toHaveBeenCalledWith(successReturnObject, dispatch, getState, 'shipping');
        });
    });

    test('When previous is same as new address', async () => {
        getAddressesMock.mockReturnValueOnce(stateMock.data.application_state.addresses.shipping);

        await postShippingAddress(dispatch, getState).then(() => {
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
            expect(getAddressesMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionReturnMock);
            expect(updateShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(setShippingAddressMock).toHaveBeenCalledTimes(0);
            expect(handleErrorMock).toHaveBeenCalledTimes(0);
        });
    });
});
