import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {ThankYou} from 'src/components';
import {
    useGetContactUs,
    useGetDisplayPaymentMethods,
    useGetFooter,
    useGetOrderRecap,
    useGetShopUrlFromShopAlias,
    useGetThankYou,
    useSupportedLanguages,
    useScreenBreakpoints,
    useGetLifeFields,
    useGetRequiresShipping,
    useGetOverlay,
} from 'src/hooks';
import {addressMock, initialDataMock} from 'src/mocks';
import {IUseContactUs, IUseFooter, IUseGetOrderRecap, IUseGetThankYou, IUseScreenBreakpoints} from 'src/types';
import {getTerm} from 'src/utils';

jest.mock('src/hooks/useGetThankYou');
jest.mock('src/hooks/useGetDisplayPaymentMethods');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooter');
jest.mock('src/hooks/useGetOrderRecap');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScreenBreakpoints');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetRequiresShipping');
jest.mock('src/hooks/useGetOverlay');
const getTermMock = mocked(getTerm, true);
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useGetThankYouMock = mocked(useGetThankYou, true);
const useGetDisplayPaymentMethodsMock = mocked(useGetDisplayPaymentMethods, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterMock = mocked(useGetFooter, true);
const useGetOrderRecapMock = mocked(useGetOrderRecap, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);
const useGetOverlayMock = mocked(useGetOverlay, true);

describe('testing ThankYou component', () => {
    const orderRecapHookReturn: IUseGetOrderRecap = {
        noOrderData: false,
        shippingAddress: addressMock,
        billingAddress: addressMock,
        shippingDescription: 'Test shipping description',
        customerDetails: [
            initialDataMock.application_state.customer.email_address,
            addressMock.phone_number,
        ],
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
    const footerRightsHookReturn: IUseFooter = {
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
        isGeneric: false
    };
    const mockScreenBreakpoints: IUseScreenBreakpoints = {
        isMobile: false,
        isTablet: true,
        isDesktop: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useScreenBreakpointsMock.mockReturnValue(mockScreenBreakpoints);
        useGetThankYouMock.mockReturnValue(propMock);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterMock.mockReturnValue(footerRightsHookReturn);
        useGetOrderRecapMock.mockReturnValue(orderRecapHookReturn);
        useGetDisplayPaymentMethodsMock.mockReturnValue(paymentMethodHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
        getTermMock.mockReturnValue('some_text');
        useGetLifeFieldsMock.mockReturnValue([]);
        useGetRequiresShippingMock.mockReturnValue(true);
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
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
