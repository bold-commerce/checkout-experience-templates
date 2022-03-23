import {render, screen} from '@testing-library/react';
import {mocked} from 'ts-jest/utils';

import {ThankYou} from 'src/components';
import {
    useGetContactUs,
    useGetDisplayPaymentMethods,
    useGetFooterRights,
    useGetOrderRecap,
    useGetShopUrlFromShopAlias,
    useGetThankYou,
    useSupportedLanguages,
    useSendEvent
} from 'src/hooks';
import {addressMock, initialDataMock} from 'src/mocks';
import {IUseContactUs, IUseFooterRights, IUseGetOrderRecap, IUseGetThankYou} from 'src/types';

jest.mock('src/hooks/useGetThankYou');
jest.mock('src/hooks/useGetDisplayPaymentMethods');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooterRights');
jest.mock('src/hooks/useGetOrderRecap');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useSendEvent');
const useGetThankYouMock = mocked(useGetThankYou, true);
const useGetDisplayPaymentMethodsMock = mocked(useGetDisplayPaymentMethods, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterRightsMock = mocked(useGetFooterRights, true);
const useGetOrderRecapMock = mocked(useGetOrderRecap, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
mocked(useSendEvent, true);

describe('testing ThankYou component', () => {
    const orderRecapHookReturn: IUseGetOrderRecap = {
        noOrderData: false,
        shippingAddress: addressMock,
        billingAddress: addressMock,
        shippingDescription: 'Test shipping description',
        terms: {
            customerInfo: 'customer info',
            shippingAddress: 'shipping address',
            billingAddress: 'billing address',
            shippingMethod: 'shipping method',
            paymentMethod: 'payment method'
        }
    };
    const paymentMethodHookReturn = {
        paymentsMethod: initialDataMock.application_state.payments,
        terms: {noPaymentMethod: 'No payment method'}
    };
    const contactUsHookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const footerRightsHookReturn: IUseFooterRights = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };
    const propMock: IUseGetThankYou = {
        returnUrl: jest.fn(),
        thankYouTitle: 'Thank you, John!',
        terms: {
            thankYou: 'Thank you',
            orderConfirmed: 'Order confirmed',
            orderConfirmedText: 'Order confirmed text',
            keepShopping: 'Keep shopping'
        },
        isGeneric: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetThankYouMock.mockReturnValue(propMock);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterRightsMock.mockReturnValue(footerRightsHookReturn);
        useGetOrderRecapMock.mockReturnValue(orderRecapHookReturn);
        useGetDisplayPaymentMethodsMock.mockReturnValue(paymentMethodHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
    });

    test('Rendering ThankYou component', () => {
        useGetThankYouMock.mockReturnValueOnce(propMock);

        const {container} = render(<ThankYou/>);

        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__message').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__order-recap').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__footer-container').length).toBe(1);
        expect(screen.getAllByText(propMock.thankYouTitle).length).toBe(1);
    });

    test('Rendering Generic ThankYou component', () => {
        const genericPropMock = {...propMock};
        genericPropMock.isGeneric = true;
        useGetThankYouMock.mockReturnValueOnce(genericPropMock);

        const {container} = render(<ThankYou/>);

        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__message').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__order-recap').length).toBe(0);
        expect(container.getElementsByClassName('thank-you__footer-container').length).toBe(1);
        expect(screen.getAllByText(propMock.thankYouTitle).length).toBe(1);
    });
});
