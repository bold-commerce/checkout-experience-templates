import {render} from '@testing-library/react';
import React from 'react';
import {CustomerSection} from 'src/components';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import {mocked} from 'jest-mock';
import {useGetShopUrlFromShopAlias} from 'src/hooks';

const store = Store.initializeStore();
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);

const shopURL = 'https://some-shop-url.test.com';
const component =
    <Provider store={store}>
        <CustomerSection/>
    </Provider>;


test('Customer Section exists', () => {
    const { container } = render(component);
    expect(container.getElementsByClassName('CustomerSection')).toBeTruthy();
});

test('Customer Section have shop alias', () => {
    useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);

    const { container } = render(component);
    expect(container.getElementsByClassName('website-title')).toBeTruthy();
});

