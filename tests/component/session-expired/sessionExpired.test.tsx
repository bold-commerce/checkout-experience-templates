import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {SessionExpired} from 'src/components';
import {
    useGetContactUs,
    useGetFooter,
    useGetShopUrlFromShopAlias,
    useScreenBreakpoints,
    useSupportedLanguages,
    useGetLifeFields,
    useGetOverlay
} from 'src/hooks';
import {IUseContactUs, IUseFooter, IUseScreenBreakpoints} from 'src/types';
import {getErrorTerm, getTerm} from 'src/utils';
import {useDispatch} from 'react-redux';

jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooter');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
jest.mock('src/hooks/useScreenBreakpoints');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/utils/getTerm');
jest.mock('src/utils/getErrorTerm');
jest.mock('src/hooks/useGetOverlay');
jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);
const getTermMock = mocked(getTerm, true);
const getErrorTermMock = mocked(getErrorTerm, true);
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterMock = mocked(useGetFooter, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);
const useGetOverlayMock = mocked(useGetOverlay, true);

describe('testing SessionExpired component', () => {
    const dispatchMock = jest.fn();
    const contactUsHookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const footerRightsHookReturn: IUseFooter = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };
    const mockScreenBreakpoints: IUseScreenBreakpoints = {
        isMobile: false,
        isTablet: true,
        isDesktop: false
    };
    const shopUrlWithAlias = 'test-shop.alias.com';
    const shopUrl = 'test-shop.com';

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
        useScreenBreakpointsMock.mockReturnValue(mockScreenBreakpoints);
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterMock.mockReturnValue(footerRightsHookReturn);
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue(shopUrl);
        getTermMock.mockReturnValue('some_text');
        getErrorTermMock.mockReturnValue('some_error_text');
        useGetLifeFieldsMock.mockReturnValue([]);
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = shopUrlWithAlias;
        useGetOverlayMock.mockReturnValue({
            shown: false,
            inverted: false,
            header: 'This is header issue',
            subHeader: 'This is sub-header issue',
            buttonText: 'back'
        });
    });

    test('Rendering SessionExpired component', () => {
        const {container} = render(<SessionExpired />);

        expect(container.getElementsByClassName('session-expired__message').length).toBe(1);
        expect(container.getElementsByClassName('session-expired__footer-container').length).toBe(1);
        expect(dispatchMock).toHaveBeenCalled();
    });

    test('Rendering SessionExpired component then click on Return to store button', () => {
        const {container} = render(<SessionExpired />);
        expect(container.getElementsByClassName('session-expired__message').length).toBe(1);
        expect(container.getElementsByClassName('session-expired__footer-container').length).toBe(1);
        expect(window.location.href).toBe('http://dummy.com');

        const element = screen.getByTestId('session-expired-back-button') as HTMLButtonElement;
        fireEvent.click(element);
        expect(window.location.href).toBe(shopUrl);
    });
});
