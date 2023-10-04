import {render} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {mocked} from 'jest-mock';

import {
    useGetBillingData,
    useGetCustomerInfoData,
    useGetShippingData,
    useGetShopUrlFromShopAlias,
    useSupportedLanguages,
    useGetValidVariable,
    useGetAppSettingData,
    useScreenBreakpoints,
    useGetLifeFields,
    useGetOverlay
} from 'src/hooks';
import {addressMock, stateMock} from 'src/mocks';
import {ThankYouPage} from 'src/pages';
import * as Store from 'src/store';
import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getTerm} from 'src/utils';
import {HelmetProvider} from 'react-helmet-async';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useSendEvent');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useScreenBreakpoints');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetOverlay');
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetBillingDataMock = mocked(useGetBillingData, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const getTermMock = mocked(getTerm, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetOverlayMock = mocked(useGetOverlay, true);

const store = Store.initializeStore();
const context = {};
const mockScreenBreakpoints = {
    isMobile: false,
    isTablet: true,
    isDesktop: false
};
HelmetProvider.canUseDOM = false;
const component =
    <Provider store={store}>
        <HelmetProvider context={context}>
            <ThankYouPage/>
        </HelmetProvider>
    </Provider>;

describe('testing ThankYouPage', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        useScreenBreakpointsMock.mockReturnValue(mockScreenBreakpoints);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
        useGetValidVariableMock.mockReturnValue(true);
        useGetAppSettingDataMock.mockReturnValue('en');
        getTermMock.mockReturnValue('test');
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
    });

    test('Rendering ThankYouPage component', () => {
        const mockedData = stateMock.data.application_state;
        useGetCustomerInfoDataMock.mockReturnValue(mockedData.customer);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useGetBillingDataMock.mockReturnValue(addressMock);
        useGetLifeFieldsMock.mockReturnValue([]);

        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering ThankYouPage component with generic page', () => {
        const mockedData = stateMock.data.application_state.customer;
        mockedData.first_name = '';
        useGetCustomerInfoDataMock.mockReturnValue(mockedData);
        useGetShippingDataMock.mockReturnValue({} as IAddress);
        useGetBillingDataMock.mockReturnValue({} as IAddress);
        useGetLifeFieldsMock.mockReturnValue([]);

        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(1);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering ThankYouPage component with generic page with orderProcessed', () => {
        const mockedData = stateMock.data.application_state;
        useGetCustomerInfoDataMock.mockReturnValue(mockedData.customer);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useGetBillingDataMock.mockReturnValue(addressMock);
        useGetValidVariableMock.mockReturnValueOnce(false);
        useGetLifeFieldsMock.mockReturnValue([]);

        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(1);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });

    test('Rendering ThankYouPage component with life elements that outside the main content', () => {
        const mockedData = stateMock.data.application_state;
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
        useGetCustomerInfoDataMock.mockReturnValue(mockedData.customer);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useGetBillingDataMock.mockReturnValue(addressMock);
        useGetLifeFieldsMock.mockReturnValue(lifeFields);

        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(2);
    });

    test('Rendering ThankYouPage component with life elements that outside the main content and orderProcessed', () => {
        const mockedData = stateMock.data.application_state;
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
        useGetCustomerInfoDataMock.mockReturnValue(mockedData.customer);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useGetBillingDataMock.mockReturnValue(addressMock);
        useGetValidVariableMock.mockReturnValueOnce(false);
        useGetLifeFieldsMock.mockReturnValue(lifeFields);

        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(3);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(2);
    });

});
