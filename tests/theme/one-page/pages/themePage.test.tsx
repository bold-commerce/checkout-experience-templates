import {initialDataMock} from 'src/mocks';
import {render} from '@testing-library/react';
import React from 'react';
import {ThemePage} from 'src/themes/one-page/pages';
import {mocked} from 'jest-mock';
import {useGetLifeFields, useGetLifeFieldsOnPage, useGetRequiresShipping, useGetShopUrlFromShopAlias} from 'src/hooks';
import {HelmetProvider} from 'react-helmet-async';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

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
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);

describe('testing ThemePage', () => {
    const context = {};
    beforeEach(() => {
        jest.clearAllMocks();

        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
    });

    test('Rendering ThemePage properly', () => {

        HelmetProvider.canUseDOM = false;
        useGetRequiresShippingMock.mockReturnValue(true);
        useGetLifeFieldsMock.mockReturnValue([]);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('main-header-mobile').length).toBe(1);
        expect(container.getElementsByClassName('summary-section').length).toBe(1);
        expect(container.getElementsByClassName('CustomerSection')).toBeTruthy();
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Customer Section have shop alias', () => {
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetRequiresShippingMock.mockReturnValue(true);
        useGetLifeFieldsMock.mockReturnValue([]);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('website-title')).toBeTruthy();
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Not rendering billing address', () => {
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetRequiresShippingMock.mockReturnValue(false);
        useGetLifeFieldsMock.mockReturnValue([]);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('shipping-address').length).toBe(1);
        expect(container.getElementsByClassName('billing-address').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering life elements that outside the main content', () => {
        const lifeFields: Array<ILifeField> = [
            {
                input_default: 'default',
                input_label: null,
                input_placeholder: 'placeholder',
                input_required: true,
                input_type: 'text',
                input_regex: null,
                location: 'main_content_beginning',
                meta_data_field: 'test_meta_data_field',
                order_asc: 1,
                public_id: '1',
            },
            {
                input_default: 'default',
                input_label: null,
                input_placeholder: 'placeholder',
                input_required: false,
                input_type: 'text',
                input_regex: 'ab*c',
                location: 'main_content_end',
                meta_data_field: 'test_meta_data_field_1',
                order_asc: 2,
                public_id: '2',
            }
        ];
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetRequiresShippingMock.mockReturnValue(true);
        useGetLifeFieldsMock.mockReturnValue(lifeFields);

        const {container} = render(<HelmetProvider context={context}><ThemePage/></HelmetProvider>);
        expect(container.getElementsByClassName('shipping-address').length).toBe(1);
        expect(container.getElementsByClassName('billing-address').length).toBe(1);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(2);
    });
});
