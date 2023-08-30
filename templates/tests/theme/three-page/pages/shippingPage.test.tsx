import {render} from '@testing-library/react';
import {ShippingLinesPage} from 'src/themes/three-page/pages';
import {IUseCustomerPageProp} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useGetShopUrlFromShopAlias,
    useScrollToElementOnNavigation
} from 'src/hooks';
import {useShippingPage} from 'src/themes/three-page/hooks';
import {HelmetProvider} from 'react-helmet-async';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: [],
    isValid: [{shippingAddress: false}]
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/themes/three-page/hooks/useShippingPage');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScrollToElementOnNavigation');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
mocked(useScrollToElementOnNavigation, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useShippingPageMock = mocked(useShippingPage, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);

describe('testing ShippingPage', () => {

    const props: IUseCustomerPageProp= {
        backLinkOnClick: jest.fn(),
        backLinkText: 'test-back',
        nextButtonOnClick: jest.fn(),
        nextButtonText: 'test-next',
        active: 2,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useShippingPageMock.mockReturnValue(props);
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
        window.headerLogoUrl = '';
    });

    test('Rendering shippingPage properly with title', () => {
        useGetLifeFieldsMock.mockReturnValue([]);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><ShippingLinesPage/></HelmetProvider>);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering shippingPage properly with logo', () => {
        useGetLifeFieldsMock.mockReturnValue([]);
        window.headerLogoUrl = 'https://headerlogo.store.com';
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><ShippingLinesPage/></HelmetProvider>);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(0);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(2);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering shippingPage properly with life elements that outside the main content', () => {
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
        useGetLifeFieldsMock.mockReturnValue(lifeFields);
        window.headerLogoUrl = 'https://headerlogo.store.com';
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><ShippingLinesPage/></HelmetProvider>);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(0);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(2);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(2);
    });
});
