import { fireEvent, render, screen } from '@testing-library/react';
import { SessionExpiredPage } from 'src/themes/buy-now/pages';
import { GenericMessageSection, CloseableHeader } from 'src/components';
import { mocked } from 'jest-mock';
import { IUseGetCloseBuyNow } from 'src/themes/buy-now/types';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { IUseSessionExpired } from 'src/types';
import { useGetSessionExpired } from 'src/hooks';
import * as analytics from 'src/analytics/analytics';
import { initialDataMock } from 'src/mocks';

const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    isValid: {orderProcessed: true}
};

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => jest.fn()
}));


jest.mock('src/components', () => ({
    ...jest.requireActual('src/components'),
    CloseableHeader: jest.fn(),
    GenericMessageSection: jest.fn(),
}));

jest.mock('src/hooks', () => ({
    ...jest.requireActual('src/hooks'),
    useGetSessionExpired: jest.fn()
}));

jest.mock('src/themes/buy-now/hooks', () => ({
    ...jest.requireActual('src/themes/buy-now/hooks'),
    useGetCloseBuyNow: jest.fn()
}));

describe('testing SessionExpiredPage', () => {
    const headerMock = mocked(CloseableHeader, true);
    const genericMessageSectionMock = mocked(GenericMessageSection, true);
    let sendPageViewSpy: jest.SpyInstance;
    let sendEventsSpy: jest.SpyInstance;
    const useGetCloseBuyNowMock = mocked(useGetCloseBuyNow, true);
    const closeModalMock: IUseGetCloseBuyNow = {
        closeBuyNow: jest.fn(),
        websiteName: 'websiteName',
        terms: {
            closeModal: 'Close Modal',
            closeModalDescription: 'Close this modal and try again'
        }
    };
    const useGetSessionExpiredMock = mocked(useGetSessionExpired, true);
    const sessionExpiredHookMock: IUseSessionExpired = {
        terms: {
            sessionExpiredHeader: 'Session expired'
        },
        returnUrl: jest.fn()
    }

    beforeEach(() => {
        headerMock.mockReturnValueOnce(<div className="header">Header</div>);
        genericMessageSectionMock.mockReturnValueOnce(<div className="message">Message</div>);
        useGetCloseBuyNowMock.mockReturnValueOnce(closeModalMock);
        useGetSessionExpiredMock.mockReturnValueOnce(sessionExpiredHookMock)
    });
    
    beforeEach(() => {
        sendPageViewSpy = jest.spyOn(analytics, 'sendPageView');
        sendEventsSpy = jest.spyOn(analytics, 'sendEvents');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    afterAll(() => {
        jest.restoreAllMocks();
    });
    
    test('rendering SessionExpiredPage properly', async () => {
        const emptyRef = {};
        
        const { container } = render(
            <SessionExpiredPage/>
        );

        expect(container.getElementsByClassName('checkout-experience-container')).toHaveLength(1);
        expect(container.getElementsByClassName('buy-now-container')).toHaveLength(1);
        expect(container.getElementsByClassName('buy-now')).toHaveLength(1);
        expect(container.getElementsByClassName('header')).toHaveLength(1);
        expect(container.getElementsByClassName('message')).toHaveLength(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);
        
        expect(headerMock).toHaveBeenCalled();
        expect(genericMessageSectionMock).toHaveBeenCalledWith(expect.objectContaining({
            messageTitle: 'Session expired',
            messageText: 'Close this modal and try again',
        }), emptyRef);
        expect(sendPageViewSpy).toHaveBeenCalled();
        expect(sendEventsSpy).toHaveBeenCalled();
    });


    test('test the return to product button', () => {
        render(
            <SessionExpiredPage/>
        );
        const button = screen.getByTestId('close-modal');
        fireEvent.click(button);
        expect(closeModalMock.closeBuyNow).toHaveBeenCalled();
    });
});
