import {render} from '@testing-library/react';
import {IFormControlsProps} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {
    useGetAppSettingData,
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useGetOverlay,
    useGetShopUrlFromShopAlias,
} from 'src/hooks';
import {HelmetProvider} from 'react-helmet-async';
import {PaymentPage} from 'src/themes/paypal/pages';
import {usePaymentPage} from 'src/themes/paypal/hooks';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: {},
    isValid: {shippingAddress: false},
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/themes/paypal/hooks/usePaymentPage');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScrollToElementOnNavigation');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
jest.mock('src/hooks/useGetOverlay');
jest.mock('src/hooks/useGetAppSettingData');
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const usePaymentPagePageMock = mocked(usePaymentPage, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);
const useGetOverlayMock = mocked(useGetOverlay, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('testing paymentPage', () => {
    const props: IFormControlsProps = {
        backLinkOnClick: jest.fn(),
        backLinkText: 'test-back',
        nextButtonText: '',
        title: undefined,
    };

    const lifeElement: ILifeField = {
        input_default: 'default',
        input_label: null,
        input_placeholder: 'placeholder',
        input_required: false,
        input_type: 'text',
        input_regex: null,
        location: 'paypal_additional_information',
        meta_data_field: 'test_meta_data_field_1',
        order_asc: 2,
        public_id: '2',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        usePaymentPagePageMock.mockReturnValue(props);
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
    });

    test('Rendering payment page properly with title', () => {
        useGetLifeFieldsMock.mockReturnValue([lifeElement]);
        useGetAppSettingDataMock.mockReturnValue(false);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><PaymentPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(container.getElementsByClassName('paypal-page').length).toBe(1);
        expect(container.getElementsByClassName('payment-section').length).toBe(1);
        expect(container.getElementsByClassName('payment-content-section').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item').length).toBe(3);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(2);
    });


    test('Rendering payment page properly with no life element', () => {
        useGetLifeFieldsMock.mockReturnValue([]);
        useGetAppSettingDataMock.mockReturnValue(true);
        window.headerLogoUrl = 'test-logo';
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><PaymentPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(container.getElementsByClassName('paypal-page').length).toBe(1);
        expect(container.getElementsByClassName('payment-section').length).toBe(1);
        expect(container.getElementsByClassName('payment-content-section').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item').length).toBe(0);
        expect(container.getElementsByClassName('website-title-logo-clickable').length).toBe(2);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });
});
