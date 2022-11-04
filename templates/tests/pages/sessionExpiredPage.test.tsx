import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {SessionExpiredPage} from 'src/pages';
import {
    useGetAppSettingData,
    useGetContactUs,
    useGetFooterRights,
    useGetSessionExpired,
    useGetShopUrlFromShopAlias,
    useSupportedLanguages
} from 'src/hooks';
import {IUseContactUs, IUseFooterRights, IUseSessionExpired} from 'src/types';
import {getTerm} from 'src/utils';
import {HelmetProvider} from 'react-helmet-async';

jest.mock('src/hooks/useGetSessionExpired');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooterRights');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/utils/getTerm');
const useGetSessionExpiredMock = mocked(useGetSessionExpired, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterRightsMock = mocked(useGetFooterRights, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const getTermMock = mocked(getTerm, true);

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
        useGetAppSettingDataMock.mockReturnValue('en');
        getTermMock.mockReturnValue('test');
    });

    test('Rendering SessionExpiredPage', () => {
        const context = {};
        HelmetProvider.canUseDOM = false;
        const {container} = render(<HelmetProvider context={context}><SessionExpiredPage /></HelmetProvider>);

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
