import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {
    useGetAppSettingData,
    useGetContactUs,
    useGetFooterRights,
    useGetOutOfStock,
    useGetShopUrlFromShopAlias,
    useSupportedLanguages
} from 'src/hooks';
import {OutOfStockPage} from 'src/pages';
import {IUseContactUs, IUseFooterRights, IUseOutOfStock} from 'src/types';
import {getTerm} from 'src/utils';
import {HelmetProvider} from 'react-helmet-async';

jest.mock('src/hooks/useGetOutOfStock');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooterRights');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/utils/getTerm');
const useGetOutOfStockMock = mocked(useGetOutOfStock, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterRightsMock = mocked(useGetFooterRights, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const getTermMock = mocked(getTerm, true);

describe('testing OutOfStockPage', () => {
    const terms: Record<string, string> = {
        returnToCart: 'Return to cart',
        outOfStockHeader: 'Inventory Issue',
        outOfStockBody: 'Inventory Issue body'
    };
    const hookReturn: IUseOutOfStock = {
        returnUrl: jest.fn(),
        terms: terms,
    };
    const contactUsHookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const footerRightsHookReturn: IUseFooterRights = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };

    beforeEach(() => {
        useGetOutOfStockMock.mockReturnValue(hookReturn);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterRightsMock.mockReturnValue(footerRightsHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
        useGetAppSettingDataMock.mockReturnValue('en');
        getTermMock.mockReturnValue('test');
    });

    test('Rendering OutOfStockPage', () => {

        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><OutOfStockPage/></HelmetProvider>);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock').length).toBe(1);
        expect(container.getElementsByClassName('main-header-mobile').length).toBe(1);
        expect(container.getElementsByClassName('main-header').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock__message').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock__footer-container').length).toBe(1);
    });
});
