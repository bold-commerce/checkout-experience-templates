import {initialDataMock} from 'src/mocks';
import {render} from '@testing-library/react';
import React from 'react';
import {ThemePage} from 'src/themes/one-page/pages';
import {mocked} from 'jest-mock';
import {useGetRequiresShipping, useGetShopUrlFromShopAlias} from 'src/hooks';
import {HelmetProvider} from 'react-helmet-async';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: [],
    isValid: {shippingAddress: false},
    externalPaymentGateways: {
        isValid: new Set(),
        isLoading: new Set(),
    },
};
const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useGetRequiresShipping');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);

describe('testing ThemePage', () => {
    const context = {};
    beforeEach(() => {
        jest.clearAllMocks();

        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
    });

    test('Rendering ThemePage properly', () => {

        HelmetProvider.canUseDOM = false;
        useGetRequiresShippingMock.mockReturnValue(true);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('main-header-mobile').length).toBe(1);
        expect(container.getElementsByClassName('summary-section').length).toBe(1);
        expect(container.getElementsByClassName('CustomerSection')).toBeTruthy();
    });

    test('Customer Section have shop alias', () => {
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetRequiresShippingMock.mockReturnValue(true);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('website-title')).toBeTruthy();
    });

    test('Not rendering billing address', () => {
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetRequiresShippingMock.mockReturnValue(false);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('shipping-address').length).toBe(1);
        expect(container.getElementsByClassName('billing-address').length).toBe(0);
    });
});
