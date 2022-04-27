import {render} from '@testing-library/react';
import {ShippingLinesPage} from 'src/themes/three-page/pages';
import {IUseCustomerPageProp} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetShopUrlFromShopAlias, useScrollToElementOnNavigation} from 'src/hooks';
import {useShippingPage} from 'src/themes/three-page/hooks';
import {neuroIdInit} from 'src/utils';

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
jest.mock('src/utils/neuroIdCalls');
mocked(useScrollToElementOnNavigation, true);
mocked(neuroIdInit, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useShippingPageMock = mocked(useShippingPage, true);

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
    });

    test('Rendering shippingPage properly', () => {
        const {container} = render(<ShippingLinesPage/>);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
    });
});
