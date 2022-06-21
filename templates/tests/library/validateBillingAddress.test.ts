import {mocked} from 'jest-mock';
import {setBillingAddressAsValid, validateBillingAddress} from 'src/library';
import {getBillingAddress, IAddress} from '@bold-commerce/checkout-frontend-library';
import * as validateAddressFunction from 'src/library/validateAddressFunction';
import * as postAddress from 'src/library/postAddress';
import {Constants, defaultAddressState} from 'src/constants';
import * as CustomerActions from 'src/action/customerAction';
import * as appActions from 'src/action/appAction';

jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
const getBillingAddressMock = mocked(getBillingAddress, true);

describe('testing validateBillingAddress', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const validateAddressMock = jest.fn();
    const postAddressReturnedFunctionMock = jest.fn();

    let validateAddressFunctionSpy: jest.SpyInstance;
    let postAddressSpy: jest.SpyInstance;
    let actionUpdateBillingAsShippingSpy: jest.SpyInstance;
    let actionRemoveErrorByAddressTypeSpy: jest.SpyInstance;

    beforeEach(() => {
        validateAddressFunctionSpy = jest.spyOn(validateAddressFunction, 'validateAddressFunction')
            .mockReturnValue(validateAddressMock);
        postAddressSpy = jest.spyOn(postAddress, 'postAddress').mockReturnValue(postAddressReturnedFunctionMock);
        actionUpdateBillingAsShippingSpy = jest.spyOn(CustomerActions, 'actionUpdateBillingAsShipping');
        actionRemoveErrorByAddressTypeSpy = jest.spyOn(appActions, 'actionRemoveErrorByAddressType');
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
            expect(actionRemoveErrorByAddressTypeSpy).toHaveBeenCalledTimes(1);
            expect(validateAddressFunctionSpy).toHaveBeenCalledTimes(1);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(getStateMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(actionUpdateBillingAsShippingSpy).toHaveBeenCalledTimes(0);
            expect(postAddressSpy).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(actionUpdateBillingAsShippingSpy);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        });
    });

    test('testing billing address same as shipping', async () => {
        getStateMock.mockReturnValueOnce({appSetting: {billingType: Constants.SHIPPING_SAME}, isValid: {shippingAddress: true},
            data: {application_state: {addresses: {shipping: defaultAddressState}}}})
            .mockReturnValueOnce({data: {application_state: {addresses: {billing: defaultAddressState}}}});
        getBillingAddressMock.mockReturnValueOnce({} as IAddress);
        await validateBillingAddress(dispatchMock, getStateMock).then(() => {
            expect(actionRemoveErrorByAddressTypeSpy).toHaveBeenCalledTimes(1);
            expect(validateAddressFunctionSpy).toHaveBeenCalledTimes(0);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(0);
            expect(getStateMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(4);
            expect(actionUpdateBillingAsShippingSpy).toHaveBeenCalledTimes(1);
            expect(postAddressSpy).toHaveBeenCalledTimes(1);
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
            expect(actionRemoveErrorByAddressTypeSpy).toHaveBeenCalledTimes(1);
            expect(validateAddressFunctionSpy).toHaveBeenCalledTimes(0);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(0);
            expect(getStateMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(actionUpdateBillingAsShippingSpy).toHaveBeenCalledTimes(1);
            expect(postAddressSpy).toHaveBeenCalledTimes(0);
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
            expect(actionRemoveErrorByAddressTypeSpy).toHaveBeenCalledTimes(1);
            expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(getStateMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(actionUpdateBillingAsShippingSpy).toHaveBeenCalledTimes(0);
            expect(postAddressSpy).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledWith(validateAddressMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        });
    });
});
