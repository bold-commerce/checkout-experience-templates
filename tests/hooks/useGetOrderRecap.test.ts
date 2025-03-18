import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {
    useGetOrderRecap,
    useGetCustomerInfoData,
    useGetShippingData,
    useGetBillingData,
    useGetSelectShippingLine, useGetRequiresShipping
} from 'src/hooks';
import {emptyAddressMock, initialDataMock} from 'src/mocks';
import {getTerm} from 'src/utils';
import {IAddress, IShippingLine} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/hooks/useGetRequiresShipping');
const getTermMock = mocked(getTerm, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetBillingDataMock = mocked(useGetBillingData, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);

describe('Testing hook useGetOrderRecap', () => {
    const shippingAddressMock: IAddress = {...initialDataMock.application_state.addresses.shipping, phone_number: '2041234567'};
    const billingAddressMock: IAddress = {...initialDataMock.application_state.addresses.billing, phone_number: '2047654321'};
    const mockResponse = {
        noOrderData: false,
        shippingAddress: shippingAddressMock,
        billingAddress: billingAddressMock,
        shippingDescription: initialDataMock.application_state.shipping.selected_shipping.description,
        customerDetails: [
            initialDataMock.application_state.customer.email_address,
            shippingAddressMock.phone_number,
        ],
        terms: {
            customerInfo: 'customer info',
            customerDetails: 'customer details',
            shippingAddress: 'shipping address',
            billingAddress: 'billing address',
            shippingMethod: 'shipping method',
            paymentMethod: 'payment method'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValue('');
        useGetCustomerInfoDataMock.mockReturnValue(initialDataMock.application_state.customer);
        useGetShippingDataMock.mockReturnValue(shippingAddressMock);
        useGetBillingDataMock.mockReturnValue(billingAddressMock);
        useGetSelectShippingLineMock.mockReturnValue(initialDataMock.application_state.shipping.selected_shipping as IShippingLine);
    });

    test('rendering the hook with all data', () => {
        getTermMock
            .mockReturnValueOnce(mockResponse.terms.customerInfo)
            .mockReturnValueOnce(mockResponse.terms.customerDetails)
            .mockReturnValueOnce(mockResponse.terms.shippingAddress)
            .mockReturnValueOnce(mockResponse.terms.billingAddress)
            .mockReturnValueOnce(mockResponse.terms.shippingMethod)
            .mockReturnValueOnce(mockResponse.terms.paymentMethod);
        useGetRequiresShippingMock.mockReturnValue(true);

        const {result} = renderHook(() => useGetOrderRecap());
        expect(result.current.noOrderData).toStrictEqual(mockResponse.noOrderData);
        expect(result.current.shippingAddress).toStrictEqual(mockResponse.shippingAddress);
        expect(result.current.billingAddress).toStrictEqual(mockResponse.billingAddress);
        expect(result.current.shippingDescription).toStrictEqual(mockResponse.shippingDescription);
        expect(result.current.terms).toStrictEqual(mockResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetShippingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetBillingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetSelectShippingLineMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(6);
        expect(getTermMock).toHaveBeenCalledWith('customer_info', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('customer_details', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_address', Constants.SHIPPING_INFO);
        expect(getTermMock).toHaveBeenCalledWith('billing_address', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_method', Constants.SHIPPING_METHOD_INFO);
        expect(getTermMock).toHaveBeenCalledWith('payment_method', Constants.PAYMENT_INFO);
    });

    test('rendering the hook with no order data', () => {
        const customer = {...initialDataMock.application_state.customer, first_name: '', email_address: ''};
        const shippingMethod = {id: '', description: '', amount: 0, code: ''};
        const newResponse = {...mockResponse, noOrderData: true, shippingDescription: '', customerDetails: []};
        useGetCustomerInfoDataMock.mockReturnValueOnce(customer);
        useGetShippingDataMock.mockReturnValueOnce(emptyAddressMock);
        useGetBillingDataMock.mockReturnValueOnce(emptyAddressMock);
        useGetSelectShippingLineMock.mockReturnValueOnce(shippingMethod);
        getTermMock
            .mockReturnValueOnce(newResponse.terms.customerInfo)
            .mockReturnValueOnce(newResponse.terms.customerDetails)
            .mockReturnValueOnce(newResponse.terms.shippingAddress)
            .mockReturnValueOnce(newResponse.terms.billingAddress)
            .mockReturnValueOnce(newResponse.terms.shippingMethod)
            .mockReturnValueOnce(newResponse.terms.paymentMethod);
        useGetRequiresShippingMock.mockReturnValue(true);

        const {result} = renderHook(() => useGetOrderRecap());
        expect(result.current.noOrderData).toStrictEqual(newResponse.noOrderData);
        expect(result.current.shippingAddress).toStrictEqual(emptyAddressMock);
        expect(result.current.billingAddress).toStrictEqual(emptyAddressMock);
        expect(result.current.shippingDescription).toStrictEqual(newResponse.shippingDescription);
        expect(result.current.customerDetails).toStrictEqual(newResponse.customerDetails);
        expect(result.current.terms).toStrictEqual(newResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetShippingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetBillingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetSelectShippingLineMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(6);
        expect(getTermMock).toHaveBeenCalledWith('customer_info', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('customer_details', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_address', Constants.SHIPPING_INFO);
        expect(getTermMock).toHaveBeenCalledWith('billing_address', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_method', Constants.SHIPPING_METHOD_INFO);
        expect(getTermMock).toHaveBeenCalledWith('payment_method', Constants.PAYMENT_INFO);
    });

    test('rendering the hook with no customer info and no shipping method', () => {
        const newResponse = {...mockResponse, noOrderData: true, shippingDescription: ''};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        useGetCustomerInfoDataMock.mockReturnValueOnce(null);
        useGetShippingDataMock.mockReturnValueOnce(emptyAddressMock);
        useGetBillingDataMock.mockReturnValueOnce(emptyAddressMock);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        useGetSelectShippingLineMock.mockReturnValueOnce(null);
        getTermMock
            .mockReturnValueOnce(newResponse.terms.customerInfo)
            .mockReturnValueOnce(newResponse.terms.customerDetails)
            .mockReturnValueOnce(newResponse.terms.shippingAddress)
            .mockReturnValueOnce(newResponse.terms.billingAddress)
            .mockReturnValueOnce(newResponse.terms.shippingMethod)
            .mockReturnValueOnce(newResponse.terms.paymentMethod);
        useGetRequiresShippingMock.mockReturnValue(true);

        const {result} = renderHook(() => useGetOrderRecap());
        expect(result.current.noOrderData).toStrictEqual(newResponse.noOrderData);
        expect(result.current.shippingAddress).toStrictEqual(emptyAddressMock);
        expect(result.current.billingAddress).toStrictEqual(emptyAddressMock);
        expect(result.current.shippingDescription).toStrictEqual(newResponse.shippingDescription);
        expect(result.current.customerDetails).toStrictEqual([]);
        expect(result.current.terms).toStrictEqual(newResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetShippingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetBillingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetSelectShippingLineMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(6);
        expect(getTermMock).toHaveBeenCalledWith('customer_info', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('customer_details', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_address', Constants.SHIPPING_INFO);
        expect(getTermMock).toHaveBeenCalledWith('billing_address', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_method', Constants.SHIPPING_METHOD_INFO);
        expect(getTermMock).toHaveBeenCalledWith('payment_method', Constants.PAYMENT_INFO);
    });

    test('rendering the hook with not requires shipping', () => {
        getTermMock
            .mockReturnValueOnce(mockResponse.terms.customerInfo)
            .mockReturnValueOnce(mockResponse.terms.customerDetails)
            .mockReturnValueOnce(mockResponse.terms.shippingAddress)
            .mockReturnValueOnce(mockResponse.terms.billingAddress)
            .mockReturnValueOnce(mockResponse.terms.shippingMethod)
            .mockReturnValueOnce(mockResponse.terms.paymentMethod);
        useGetRequiresShippingMock.mockReturnValue(false);

        const {result} = renderHook(() => useGetOrderRecap());
        expect(result.current.noOrderData).toStrictEqual(mockResponse.noOrderData);
        expect(result.current.shippingAddress).toStrictEqual(mockResponse.shippingAddress);
        expect(result.current.billingAddress).toStrictEqual(mockResponse.billingAddress);
        expect(result.current.terms).toStrictEqual(mockResponse.terms);
        expect(result.current.customerDetails).toStrictEqual([
            mockResponse.customerDetails[0],
            mockResponse.billingAddress.phone_number,
        ]);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetShippingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetBillingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetSelectShippingLineMock).toHaveBeenCalledTimes(1);
        expect(useGetShippingDataMock).toHaveBeenCalledTimes(1);
        expect(useGetRequiresShippingMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledWith('customer_info', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('customer_details', Constants.CUSTOMER_INFO);
        expect(getTermMock).not.toHaveBeenCalledWith('shipping_address', Constants.SHIPPING_INFO);
        expect(getTermMock).toHaveBeenCalledWith('billing_address', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('shipping_method', Constants.SHIPPING_METHOD_INFO);
        expect(getTermMock).toHaveBeenCalledWith('payment_method', Constants.PAYMENT_INFO);
    });
});
