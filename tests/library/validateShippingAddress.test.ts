import {mocked} from 'ts-jest/utils';
import {generateTaxes, validateShippingAddress} from 'src/library';
import {getShippingAddress} from '@bold-commerce/checkout-frontend-library';
import * as validateAddressFunction from 'src/library/validateAddressFunction';
import {defaultAddressState} from 'src/constants';

jest.mock('@bold-commerce/checkout-frontend-library');
const getShippingAddressMock = mocked(getShippingAddress, true);
jest.mock('src/library/generateTaxes');
const generateTaxesMock = mocked(generateTaxes, true);

describe('testing validateShippingAddress', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const validateAddressMock = jest.fn();

    let validateAddressFunctionSpy: jest.SpyInstance;

    beforeEach(() => {
        validateAddressFunctionSpy = jest.spyOn(validateAddressFunction, 'validateAddressFunction').mockReturnValue(validateAddressMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('testing updated address true', async () => {
        getStateMock.mockReturnValueOnce({data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({isValid: {updatedShippingAddress: true}});
        getShippingAddressMock.mockReturnValueOnce({});
        await validateShippingAddress(dispatchMock, getStateMock).then(() => {
            expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).toHaveBeenCalledWith(generateTaxesMock);
        });
    });

    test('testing updated address false', async () => {
        getStateMock.mockReturnValueOnce({data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({isValid: {updatedShippingAddress: false}});
        getShippingAddressMock.mockReturnValueOnce({});
        await validateShippingAddress(dispatchMock, getStateMock).then(() => {
            expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
        });
    });
});
