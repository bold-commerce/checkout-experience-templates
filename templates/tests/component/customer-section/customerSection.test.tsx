import {render} from '@testing-library/react';
import React from 'react';
import {CustomerSection} from 'src/components';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import {mocked} from 'jest-mock';
import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {storeMock} from 'src/mocks';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/hooks/useGetShopUrlFromShopAlias');
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);

const shopURL = 'https://some-shop-url.test.com';

test('Customer Section exists', () => {
    const { container } = render(<CustomerSection/>);
    expect(container.getElementsByClassName('CustomerSection')).toBeTruthy();
});

test('Customer Section have shop alias', () => {
    useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);

    const { container } = render(<CustomerSection/>);
    expect(container.getElementsByClassName('website-title')).toBeTruthy();
});

