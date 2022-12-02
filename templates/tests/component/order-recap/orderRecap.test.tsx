import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {OrderRecap} from 'src/components';
import {useGetDisplayPaymentMethods, useGetOrderRecap} from 'src/hooks';
import {addressMock, initialDataMock} from 'src/mocks';
import {IUseGetOrderRecap} from 'src/types';
import {getTerm} from "src/utils";

jest.mock('src/hooks/useGetOrderRecap');
jest.mock('src/hooks/useGetDisplayPaymentMethods');
jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);
const useGetOrderRecapMock = mocked(useGetOrderRecap, true);
const useGetDisplayPaymentMethodsMock = mocked(useGetDisplayPaymentMethods, true);

describe('testing OrderRecap component', () => {
    const terms: Record<string, string> = {
        customerInfo: 'customer info',
        shippingAddress: 'shipping address',
        billingAddress: 'billing address',
        shippingMethod: 'shipping method',
        paymentMethod: 'payment method'
    };
    const hookReturn: IUseGetOrderRecap = {
        noOrderData: false,
        shippingAddress: addressMock,
        billingAddress: addressMock,
        shippingDescription: 'Test shipping description',
        terms
    };
    const paymentMethodHookReturn = {
        paymentsMethod: initialDataMock.application_state.payments,
        terms: {noPaymentMethod: 'No payment method'}
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetOrderRecapMock.mockReturnValue(hookReturn);
        useGetDisplayPaymentMethodsMock.mockReturnValue(paymentMethodHookReturn);
        getTermMock.mockReturnValue('some_text');
    });

    const dataArray = [
        {
            name: 'Rendering OrderRecap component with noOrderData false',
            hookReturnOnce: {...hookReturn, noOrderData: false},
            counters: {
                order_recap__container: 1,
                order_recap__title: 1,
                order_recap__display_item: 4,
                order_recap__display_item__shipping_address: 1,
                order_recap__display_item__billing_address: 1,
                display_address_container: 2,
                order_recap__display_item__shipping_method: 1,
                order_recap__display_item__payments_method: 1,
                display_payment_methods_container: 1,
                getAllByText_customer_info: 1
            }
        },
        {
            name: 'Rendering OrderRecap component with noOrderData true',
            hookReturnOnce: {...hookReturn, noOrderData: true},
            counters: {
                order_recap__container: 0,
                order_recap__title: 0,
                order_recap__display_item: 0,
                order_recap__display_item__shipping_address: 0,
                order_recap__display_item__billing_address: 0,
                display_address_container: 0,
                order_recap__display_item__shipping_method: 0,
                order_recap__display_item__payments_method: 0,
                display_payment_methods_container: 0,
            }
        }
    ];

    test.each(dataArray)( '$name', ({counters, hookReturnOnce}) => {
        useGetOrderRecapMock.mockReturnValueOnce(hookReturnOnce);
        const {container} = render(<OrderRecap className={'test-class'} />);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('order-recap').length).toBe(1);
        expect(container.getElementsByClassName('order-recap__container').length).toBe(counters.order_recap__container);
        expect(container.getElementsByClassName('order-recap__title').length).toBe(counters.order_recap__title);
        expect(container.getElementsByClassName('order-recap__display-item').length).toBe(counters.order_recap__display_item);
        expect(container.getElementsByClassName('order-recap__display-item--shipping-address').length).toBe(counters.order_recap__display_item__shipping_address);
        expect(container.getElementsByClassName('order-recap__display-item--billing-address').length).toBe(counters.order_recap__display_item__billing_address);
        expect(container.getElementsByClassName('display-address-container').length).toBe(counters.display_address_container);
        expect(container.getElementsByClassName('order-recap__display-item--shipping-method').length).toBe(counters.order_recap__display_item__shipping_method);
        expect(container.getElementsByClassName('order-recap__display-item--payments-method').length).toBe(counters.order_recap__display_item__payments_method);
        expect(container.getElementsByClassName('display-payment-methods-container').length).toBe(counters.display_payment_methods_container);
        counters.getAllByText_customer_info && expect(screen.getAllByText('customer info').length).toBe(counters.getAllByText_customer_info);
    });
});
