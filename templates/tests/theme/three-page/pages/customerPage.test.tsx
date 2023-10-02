import {render} from '@testing-library/react';
import {CustomerPage} from 'src/themes/three-page/pages';
import {IFrontEndEvent, IUseCustomerPageProp} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useGetOverlay,
    useGetRequiresShipping,
    useGetShopUrlFromShopAlias,
    useScreenBreakpoints,
    useScrollToElementOnNavigation,
    useSendEvent
} from 'src/hooks';
import {useCustomerPage} from 'src/themes/three-page/hooks';
import {HelmetProvider} from 'react-helmet-async';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    externalPaymentGateways: {
        isValid: new Set(),
        isLoading: new Set(),
    },
    isLoading: {},
    isValid: {shippingAddress: false},
};
const mockScreenBreakpoints = {
    isMobile: false,
    isTablet: true,
    isDesktop: false
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/themes/three-page/hooks/useCustomerPage');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScrollToElementOnNavigation');
jest.mock('src/hooks/useSendEvent');
jest.mock('src/hooks/useScreenBreakpoints');
jest.mock('src/hooks/useGetRequiresShipping');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
jest.mock('src/hooks/useGetOverlay');
mocked(useScrollToElementOnNavigation, true);
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useCustomerPageMock = mocked(useCustomerPage, true);
const useSendEventMock = mocked(useSendEvent, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);
const useGetOverlayMock = mocked(useGetOverlay, true);
let addEventListenerSpy: jest.SpyInstance;

describe('testing CustomerPage', () => {
    const props: IUseCustomerPageProp= {
        backLinkOnClick: jest.fn(),
        backLinkText: 'test-back',
        nextButtonOnClick: jest.fn(),
        nextButtonText: 'test-next',
        active: 1,
        title: undefined,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCustomerPageMock.mockReturnValue(props);
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useScreenBreakpointsMock.mockReturnValue(mockScreenBreakpoints);
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
        addEventListenerSpy = jest.spyOn(global, 'addEventListener');

        window.headerLogoUrl = '';
        window.publicOrderId = 'pubOrderIDMultiEvent';
        window.initialTimestamps = {
            'CheckoutExperienceDomLoading': '2022-09-03 15:00:00.000',
            'CheckoutExperienceComplete': '2022-09-03 15:00:00.500'
        } as IFrontEndEvent;
    });

    test('Rendering customerPage properly with title', () => {
        useGetLifeFieldsMock.mockReturnValue([]);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><CustomerPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(useSendEventMock).toHaveBeenCalled();
        expect(addEventListenerSpy).toHaveBeenCalled();
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering customerPage properly with logo', () => {
        useGetLifeFieldsMock.mockReturnValue([]);
        window.headerLogoUrl = 'logo.shop.com';
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><CustomerPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(useSendEventMock).toHaveBeenCalled();
        expect(addEventListenerSpy).toHaveBeenCalled();
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(0);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(2);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering customerPage properly when page innerWidth <= 767px', () => {
        useScreenBreakpointsMock.mockReturnValue({...mockScreenBreakpoints, isMobile: true});
        useGetLifeFieldsMock.mockReturnValue([]);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><CustomerPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(useSendEventMock).toHaveBeenCalled();
        expect(addEventListenerSpy).toHaveBeenCalled();
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering customerPage properly when not requires shipping', () => {
        useGetRequiresShippingMock.mockReturnValue(false);
        useGetLifeFieldsMock.mockReturnValue([]);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><CustomerPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
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
        useGetRequiresShippingMock.mockReturnValue(true);
        useGetLifeFieldsMock.mockReturnValue(lifeFields);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><CustomerPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(container.getElementsByClassName('shipping-address').length).toBe(1);
        expect(container.getElementsByClassName('billing-address').length).toBe(1);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(2);
    });
});
