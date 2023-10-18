import {render} from '@testing-library/react';
import {IFormControlsProps} from 'src/types';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useGetOverlay,
    useGetShopUrlFromShopAlias,
} from 'src/hooks';
import {HelmetProvider} from 'react-helmet-async';
import {AdditionalInformationPage} from 'src/themes/paypal/pages';
import {useAdditionalInformationPage} from 'src/themes/paypal/hooks';

const shopURL = 'https://some-shop-url.test.com';
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: {},
    isValid: {shippingAddress: false},
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/themes/paypal/hooks/useAdditionalInformationPage');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScrollToElementOnNavigation');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
jest.mock('src/hooks/useGetOverlay');
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useAdditionalInformationPageMock = mocked(useAdditionalInformationPage, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);
const useGetOverlayMock = mocked(useGetOverlay, true);

describe('testing CustomerPage', () => {
    const props: IFormControlsProps = {
        backLinkOnClick: jest.fn(),
        backLinkText: 'test-back',
        nextButtonOnClick: jest.fn(),
        nextButtonText: 'test-next',
        title: undefined,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useAdditionalInformationPageMock.mockReturnValue(props);
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopURL);
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
    });

    test('Rendering additional information page  properly with title', () => {
        useGetLifeFieldsMock.mockReturnValue([]);
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><AdditionalInformationPage/></HelmetProvider>);
        global.dispatchEvent(new Event('load'));
        expect(container.getElementsByClassName('paypal-page').length).toBe(1);
        expect(container.getElementsByClassName('additional-info-section').length).toBe(1);
        expect(container.getElementsByClassName('website-title').length).toBe(2);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);
        expect(container.getElementsByClassName('outside-main-content').length).toBe(0);
    });
});
