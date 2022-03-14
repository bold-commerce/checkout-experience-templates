import {render} from '@testing-library/react';
import {CustomerPage} from 'src/pages';
import {IFrontEndEvent, IUseCustomerPageProp} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'ts-jest/utils';
import {useCustomerPage, useGetShopUrlFromShopAlias, useScrollToElementOnNavigation, useSendEvent} from 'src/hooks';

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
jest.mock('src/hooks/useSendEvent');
mocked(useScrollToElementOnNavigation, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useCustomerPageMock = mocked(useCustomerPage, true);
const useSendEventMock = mocked(useSendEvent, true);
let addEventListenerSpy: jest.SpyInstance;

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
        addEventListenerSpy = jest.spyOn(global, 'addEventListener');

        window.publicOrderId = 'pubOrderIDMultiEvent';
        window.initialTimestamps = {
            'CheckoutExperienceDomLoading': '2022-09-03 15:00:00.000',
            'CheckoutExperienceComplete': '2022-09-03 15:00:00.500'
        } as IFrontEndEvent;
    });

    test('Rendering customerPage properly', () => {
        const {container} = render(<CustomerPage/>);
        global.dispatchEvent(new Event('load'));
        expect(useSendEventMock).toHaveBeenCalled();
        expect(addEventListenerSpy).toHaveBeenCalled();
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('customer-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
    });
});
