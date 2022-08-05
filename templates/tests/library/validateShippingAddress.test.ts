import {mocked} from 'jest-mock';
import {generateTaxes, validateShippingAddress, validateAddressFunction} from 'src/library';
import {getShippingAddress, IAddress} from '@bold-commerce/checkout-frontend-library';
import {defaultAddressState} from 'src/constants';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('src/library/generateTaxes');
jest.mock('src/library/validateAddressFunction');
const getShippingAddressMock = mocked(getShippingAddress, true);
const generateTaxesMock = mocked(generateTaxes, true);
const validateAddressFunctionMock = mocked(validateAddressFunction, true);

describe('testing validateShippingAddress', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const validateAddressMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        validateAddressFunctionMock.mockReturnValue(validateAddressMock);
    });

    test('testing updated address true', async () => {
        getStateMock.mockReturnValueOnce({data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({isValid: {updatedShippingAddress: true}});
        getShippingAddressMock.mockReturnValueOnce({} as IAddress);
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
        getShippingAddressMock.mockReturnValueOnce({} as IAddress);
        await validateShippingAddress(dispatchMock, getStateMock).then(() => {
            expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
        });
    });
});
