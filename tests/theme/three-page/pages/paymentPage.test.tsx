import {IUsePaymentPage} from 'src/types';
import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {useGetShopUrlFromShopAlias, useScrollToElementOnNavigation} from 'src/hooks';
import {PaymentPage} from 'src/themes/three-page/pages';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {HelmetProvider} from 'react-helmet-async';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: {},
    externalPaymentGateways: {
        isLoading: new Set(),
        isValid: new Set(),
    },
    isValid: {shippingAddress: false},
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/themes/three-page/hooks/usePaymentPage');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScrollToElementOnNavigation');
mocked(useScrollToElementOnNavigation, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const usePaymentPageMock = mocked(usePaymentPage, true);

describe('testing PaymentPage', () => {

    const props: IUsePaymentPage= {
        backLinkOnClick: jest.fn(),
        backLinkText: 'test-back',
        nextButtonOnClick: jest.fn(),
        nextButtonText: 'test-next',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        usePaymentPageMock.mockReturnValue(props);
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
    });

    test('Rendering PaymentPage properly', () => {
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><PaymentPage/></HelmetProvider>);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
    });
});
