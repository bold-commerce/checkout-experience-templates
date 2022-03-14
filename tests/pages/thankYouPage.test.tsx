import {render} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {mocked} from 'ts-jest/utils';

import {
    useGetBillingData,
    useGetCustomerInfoData,
    useGetShippingData,
    useGetShopUrlFromShopAlias,
    useSupportedLanguages,
    useSendEvent
} from 'src/hooks';
import {addressMock, stateMock} from 'src/mocks';
import {ThankYouPage} from 'src/pages';
import * as Store from 'src/store';
import {IAddress} from 'src/types';

jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useSendEvent');
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetBillingDataMock = mocked(useGetBillingData, true);

const store = Store.initializeStore();
const component =
    <Provider store={store}>
        <ThankYouPage/>
    </Provider>;

describe('testing ThankYouPage', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
    });

    test('Rendering ThankYouPage component', () => {
        const mockedData = stateMock.data.application_state;
        useGetCustomerInfoDataMock.mockReturnValue(mockedData.customer);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useGetBillingDataMock.mockReturnValue(addressMock);

        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(0);
    });

    test('Rendering ThankYouPage component with generic page', () => {
        const mockedData = stateMock.data.application_state.customer;
        mockedData.first_name = '';
        useGetCustomerInfoDataMock.mockReturnValue(mockedData);
        useGetShippingDataMock.mockReturnValue({} as IAddress);
        useGetBillingDataMock.mockReturnValue({} as IAddress);
        const {container} = render(component);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(1);
    });

});
