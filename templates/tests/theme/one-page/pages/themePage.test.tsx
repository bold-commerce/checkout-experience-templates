import {initialDataMock} from 'src/mocks';
import {render} from '@testing-library/react';
import React from 'react';
import {ThemePage} from 'src/themes/one-page/pages';
import {mocked} from 'jest-mock';
import {useGetShopUrlFromShopAlias} from 'src/hooks';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: [],
    isValid: {shippingAddress: false}
};
const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);

describe('testing ThemePage', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
    });

    test('Rendering ThemePage properly', () => {
        const {container} = render(<ThemePage/>);
        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('header-mobile').length).toBe(1);
        expect(container.getElementsByClassName('summary-section').length).toBe(1);
    });
});
