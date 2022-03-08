import {render} from '@testing-library/react';
import {CustomerPage} from 'src/pages';
import {IUseCustomerPageProp} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'ts-jest/utils';
import {useCustomerPage, useGetShopUrlFromShopAlias, useScrollToElementOnNavigation} from 'src/hooks';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: []
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/hooks/useCustomerPage');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScrollToElementOnNavigation');
mocked(useScrollToElementOnNavigation, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useCustomerPageMock = mocked(useCustomerPage, true);

describe('testing CustomerPage', () => {

    const props: IUseCustomerPageProp= {
        backLinkOnClick: jest.fn(),
        backLinkText: 'test-back',
        nextButtonOnClick: jest.fn(),
        nextButtonText: 'test-next',
        active: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCustomerPageMock.mockReturnValue(props);
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
    });

    test('Rendering customerPage properly', () => {
        const {container} = render(<CustomerPage/>);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
    });
});