import {getBillingAddress, IAddress} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {actionUpdateBillingAsShipping, actionRemoveErrorByAddressType} from 'src/action';
import {Constants, defaultAddressState} from 'src/constants';
import {setBillingAddressAsValid, validateBillingAddress, validateAddressFunction, postAddress} from 'src/library';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/action/appAction');
jest.mock('src/action/customerAction');
jest.mock('src/library/validateAddressFunction');
jest.mock('src/library/postAddress');
const getBillingAddressMock = mocked(getBillingAddress, true);
const validateAddressFunctionMock = mocked(validateAddressFunction, true);
const postAddressMock = mocked(postAddress, true);
const actionUpdateBillingAsShippingMock = mocked(actionUpdateBillingAsShipping, true);
const actionRemoveErrorByAddressTypeMock = mocked(actionRemoveErrorByAddressType, true);

describe('testing validateBillingAddress', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const validateAddressMock = jest.fn();
    const postAddressReturnedFunctionMock = jest.fn();

    beforeEach(() => {
        validateAddressFunctionMock.mockReturnValue(validateAddressMock);
        postAddressMock.mockReturnValue(postAddressReturnedFunctionMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('testing billing address different from shipping', async () => {
        getStateMock.mockReturnValueOnce({appSetting: {billingType: Constants.SHIPPING_DIFFERENT}, isValid: {shippingAddress: true},
            data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({data: {application_state: {addresses: {billing: defaultAddressState}}}});
        getBillingAddressMock.mockReturnValueOnce({} as IAddress);
        await validateBillingAddress(dispatchMock, getStateMock).then(() => {
            expect(actionRemoveErrorByAddressTypeMock).toHaveBeenCalledTimes(1);
            expect(validateAddressFunctionMock).toHaveBeenCalledTimes(1);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(getStateMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(actionUpdateBillingAsShippingMock).toHaveBeenCalledTimes(0);
            expect(postAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(actionUpdateBillingAsShippingMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        });
    });

    test('testing billing address same as shipping', async () => {
        getStateMock.mockReturnValueOnce({appSetting: {billingType: Constants.SHIPPING_SAME}, isValid: {shippingAddress: true},
            data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({data: {application_state: {addresses: {billing: defaultAddressState}}}});
        getBillingAddressMock.mockReturnValueOnce({} as IAddress);
        await validateBillingAddress(dispatchMock, getStateMock).then(() => {
            expect(actionRemoveErrorByAddressTypeMock).toHaveBeenCalledTimes(1);
            expect(validateAddressFunctionMock).toHaveBeenCalledTimes(0);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(0);
            expect(getStateMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(4);
            expect(actionUpdateBillingAsShippingMock).toHaveBeenCalledTimes(1);
            expect(postAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).toHaveBeenCalledWith(setBillingAddressAsValid);
        });
    });

    test('testing shipping address not valid and billing address same as shipping', async () => {
        getStateMock.mockReturnValueOnce({appSetting: {billingType: Constants.SHIPPING_SAME}, isValid: {shippingAddress: false},
            data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({data: {application_state: {addresses: {billing: defaultAddressState}}}});
        getBillingAddressMock.mockReturnValueOnce({} as IAddress);
        await validateBillingAddress(dispatchMock, getStateMock).then(() => {
            expect(actionRemoveErrorByAddressTypeMock).toHaveBeenCalledTimes(1);
            expect(validateAddressFunctionMock).toHaveBeenCalledTimes(0);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(0);
            expect(getStateMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(actionUpdateBillingAsShippingMock).toHaveBeenCalledTimes(1);
            expect(postAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatchMock).not.toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        });
    });

    test('testing shipping address not valid and billing address different from shipping', async () => {
        getStateMock.mockReturnValueOnce({appSetting: {billingType: Constants.SHIPPING_DIFFERENT}, isValid: {shippingAddress: true},
            data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({data: {application_state: {addresses: {billing: defaultAddressState}}}});
        getBillingAddressMock.mockReturnValueOnce({} as IAddress);
        await validateBillingAddress(dispatchMock, getStateMock).then(() => {
            expect(actionRemoveErrorByAddressTypeMock).toHaveBeenCalledTimes(1);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(getStateMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(actionUpdateBillingAsShippingMock).toHaveBeenCalledTimes(0);
            expect(postAddressMock).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        });
    });
});
