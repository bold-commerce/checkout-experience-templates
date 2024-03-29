import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {SessionExpiredPage} from 'src/pages';
import {
    useGetAppSettingData,
    useGetContactUs,
    useGetFooter,
    useGetSessionExpired,
    useGetShopUrlFromShopAlias,
    useScreenWidth,
    useSupportedLanguages,
    useGetLifeFields,
    useGetOverlay,
} from 'src/hooks';
import {IUseContactUs, IUseFooter, IUseSessionExpired} from 'src/types';
import {getErrorTerm, getTerm} from 'src/utils';
import {HelmetProvider} from 'react-helmet-async';
import {useDispatch} from 'react-redux';

jest.mock('src/hooks/useGetSessionExpired');
jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooter');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/utils/getTerm');
jest.mock('src/utils/getErrorTerm');
jest.mock('src/hooks/useScreenWidth');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetOverlay');
jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);
const useScreenWidthMock = mocked(useScreenWidth, true);
const useGetSessionExpiredMock = mocked(useGetSessionExpired, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterMock = mocked(useGetFooter, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const getTermMock = mocked(getTerm, true);
const getErrorTermMock = mocked(getErrorTerm, true);
const useGetOverlayMock = mocked(useGetOverlay, true);

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
    const footerRightsHookReturn: IUseFooter = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
        useScreenWidthMock.mockReturnValue(1024);
        useGetSessionExpiredMock.mockReturnValue(hookReturn);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterMock.mockReturnValue(footerRightsHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
        useGetAppSettingDataMock.mockReturnValue('en');
        getTermMock.mockReturnValue('test');
        getErrorTermMock.mockReturnValue('error');
        useGetLifeFieldsMock.mockReturnValue([]);
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
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
        expect(dispatchMock).toHaveBeenCalled();
    });
});
