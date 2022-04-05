import {render} from '@testing-library/react';
import {CustomerPage} from 'src/pages';
import {IUseCustomerPageProp} from 'src/types';
import React from 'react';
import {mocked} from 'jest-mock';
import {useCustomerPage, useGetShopUrlFromShopAlias} from 'src/hooks';
import {createBrowserHistory} from 'history';
import {scrollToElement} from 'src/utils';
import {Router} from 'react-router';
import {initialDataMock} from 'src/mocks';

const history = createBrowserHistory();
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
jest.mock('src/utils/scrollToElement');
const scrollToElementMock = mocked(scrollToElement, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useCustomerPageMock = mocked(useCustomerPage, true);

describe('testing useScrollToElementOnNavigation', () => {
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

    test('Rendering useScrollToElementOnNavigation properly', () => {
        render(<Router history={history}><CustomerPage/></Router>);

        expect(scrollToElementMock).toHaveBeenCalledTimes(0);
        history.push('#test');
        expect(scrollToElementMock).toHaveBeenCalledTimes(1);
    });
});
