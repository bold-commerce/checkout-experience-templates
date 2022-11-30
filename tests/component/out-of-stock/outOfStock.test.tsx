import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {OutOfStock} from 'src/components';
import {
    useGetContactUs,
    useGetFooterRights,
    useGetOutOfStock,
    useGetShopUrlFromShopAlias,
    useScreenBreakpoints,
    useSupportedLanguages
} from 'src/hooks';
import {IUseContactUs, IUseFooterRights, IUseOutOfStock, IUseScreenBreakpoints} from 'src/types';

jest.mock('src/hooks/useGetOutOfStock');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooterRights');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScreenBreakpoints');
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useGetOutOfStockMock = mocked(useGetOutOfStock, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterRightsMock = mocked(useGetFooterRights, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);

describe('Testing OutOfStock component', () => {
    const contactUsHookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const footerRightsHookReturn: IUseFooterRights = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };
    const terms: Record<string, string> = {
        returnToCart: 'Return to cart',
        outOfStockHeader: 'Inventory Issue',
        outOfStockBody: 'Inventory Issue body'
    };
    const hookReturn: IUseOutOfStock = {
        returnUrl: jest.fn(),
        terms: terms,
    };
    const mockScreenBreakpoints: IUseScreenBreakpoints = {
        isMobile: false,
        isTablet: true,
        isDesktop: false
    };

    beforeEach(() => {
        useScreenBreakpointsMock.mockReturnValue(mockScreenBreakpoints);
        useGetOutOfStockMock.mockReturnValue(hookReturn);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterRightsMock.mockReturnValue(footerRightsHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
    });

    test('Render the component properly', () => {
        const {container} = render(<OutOfStock/>);

        expect(container.getElementsByClassName('out-of-stock__message').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock__footer-container').length).toBe(1);
        expect(container.getElementsByClassName('main-header').length).toBe(1);
        expect(container.getElementsByClassName('generic-message-section').length).toBe(1);
        expect(container.getElementsByClassName('footer').length).toBe(1);
        expect(useGetOutOfStockMock).toHaveBeenCalledTimes(1);
    });

});
