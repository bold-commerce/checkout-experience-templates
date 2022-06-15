import {stateMock} from 'src/mocks/stateMock';
import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    getBillingAddress,
    setBillingAddress,
    updateBillingAddress,
} from '@bold-commerce/checkout-frontend-library';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import {defaultAddressState} from 'src/constants';
import {postBillingAddress, setBillingAddressAsValid} from 'src/library';
import { addressMock } from 'src/mocks';
import * as appAction from 'src/action/appAction';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('@bold-commerce/checkout-frontend-library/lib/address');
const setBillingAddressMock = mocked(setBillingAddress, true);
const updateBillingAddressMock = mocked(updateBillingAddress, true);
const getAddressesMock = mocked(getBillingAddress, true);

describe('testing postBillingAddress', () => {
    const returnObject = {...baseReturnObject};
    const dispatch = jest.fn();
    const getState = jest.fn();
    const fakeInvalidData = {something: 'different'};
    const handleErrorSpy = jest.spyOn(handleErrorIfNeeded, 'handleErrorIfNeeded');
    const actionSetAppStateValidSpy = jest.spyOn(appAction, 'actionSetAppStateValid');

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        handleErrorSpy.mockImplementation();
    });

    test('calling post billing address endpoint with getState returning undefined', async () => {
        getState.mockReturnValueOnce(undefined);
        const expectedError = new TypeError("Cannot destructure property `data` of 'undefined' or 'null'.");

        await expect(async () => {
            await postBillingAddress(dispatch, getState);
        }).rejects.toThrow(expectedError);
        
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(getAddressesMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidSpy).toHaveBeenCalledTimes(1);
    });

    test('calling post billing address endpoint with getState returning a different data structure', async () => {
        getState.mockReturnValueOnce(fakeInvalidData);
        const expectedError = new TypeError("Cannot destructure property `application_state` of 'undefined' or 'null'.");
        
        await expect(async () => {
            await postBillingAddress(dispatch, getState);
        }).rejects.toThrow(expectedError);
        
        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(getAddressesMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidSpy).toHaveBeenCalledTimes(1);
    });

    test('calling post billing address with empty address', async () => {
        returnObject.success = true;
        getAddressesMock.mockReturnValueOnce(defaultAddressState);
        setBillingAddressMock.mockResolvedValue(returnObject);

        await postBillingAddress(dispatch, getState);

        expect(setBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toBeCalledTimes(1);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidSpy).toHaveBeenCalledTimes(1);

    });

    test('calling post billing address with different address', async () => {
        const address = {...defaultAddressState};
        address.address_line_1 = 'test_address';
        getAddressesMock.mockReturnValueOnce(address);

        await postBillingAddress(dispatch, getState);

        expect(setBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toBeCalledTimes(1);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(setBillingAddressAsValid);
    });

    test('calling post billing address with same address', async () => {
        getAddressesMock.mockReturnValueOnce(stateMock.data.application_state.addresses.billing);

        await postBillingAddress(dispatch, getState);

        expect(setBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toBeCalledTimes(0);
        expect(handleErrorSpy).toHaveBeenCalledTimes(0);
        expect(actionSetAppStateValidSpy).toHaveBeenCalledTimes(2);
    });

    test('calling post billing address with different saved address', async () => {
        getAddressesMock.mockReturnValueOnce(addressMock);

        await postBillingAddress(dispatch, getState);
    
        expect(setBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(updateBillingAddressMock).toHaveBeenCalledTimes(0);
        expect(setBillingAddressMock).toBeCalledTimes(1);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(setBillingAddressAsValid);
    });
});
