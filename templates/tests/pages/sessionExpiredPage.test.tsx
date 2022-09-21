import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {SessionExpiredPage} from 'src/pages';
import {
    useGetContactUs,
    useGetFooterRights,
    useGetSessionExpired,
    useGetShopUrlFromShopAlias,
    useSupportedLanguages
} from 'src/hooks';
import {IUseContactUs, IUseFooterRights, IUseSessionExpired} from 'src/types';
import {neuroIdInit} from 'src/utils';

jest.mock('src/hooks/useGetSessionExpired');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooterRights');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/utils/neuroIdCalls');
mocked(neuroIdInit, true);
const useGetSessionExpiredMock = mocked(useGetSessionExpired, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterRightsMock = mocked(useGetFooterRights, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);

describe('testing SessionExpiredPage', () => {
    const terms: Record<string, string> = {
        returnToCart: 'return to cart',
        sessionExpiredHeader: 'session expired header',
        sessionExpiredBody: 'session expired body'
    };
    const hookReturn: IUseSessionExpired = {
        returnUrl: jest.fn(),
        terms
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
        useGetSessionExpiredMock.mockReturnValue(hookReturn);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterRightsMock.mockReturnValue(footerRightsHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
    });

    test('Rendering SessionExpiredPage', () => {
        const {container} = render(<SessionExpiredPage />);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('three-page').length).toBe(1);
        expect(container.getElementsByClassName('no-summary').length).toBe(1);
        expect(container.getElementsByClassName('session-expired').length).toBe(1);
        expect(container.getElementsByClassName('main-header-mobile').length).toBe(1);
        expect(container.getElementsByClassName('main-header').length).toBe(1);
        expect(container.getElementsByClassName('session-expired__message').length).toBe(1);
        expect(container.getElementsByClassName('session-expired__footer-container').length).toBe(1);
    });
});
