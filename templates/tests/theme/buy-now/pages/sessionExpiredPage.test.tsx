import { render } from '@testing-library/react';
import { SessionExpiredPage } from 'src/themes/buy-now/pages';
import * as Store from 'src/store';
import { Provider } from 'react-redux';
import { ISessionExpiredPageProps } from 'src/themes/buy-now/types';
import { getErrorTerm } from 'src/utils';
import { Header, Footer, GenericMessageSection } from 'src/components';
import { mocked } from 'jest-mock';
import * as analytics from 'src/analytics/analytics';

const store = Store.initializeStore();
jest.mock('src/utils', () => ({
    ...jest.requireActual('src/utils'),
    getErrorTerm: jest.fn(),
}));

jest.mock('src/components', () => ({
    ...jest.requireActual('src/components'),
    Header: jest.fn(),
    Footer: jest.fn(),
    GenericMessageSection: jest.fn(),
}));

describe('testing SessionExpiredPage', () => {
    const getErrorTermMock = mocked(getErrorTerm, true);
    const headerMock = mocked(Header, true);
    const footerMock = mocked(Footer, true);
    const genericMessageSectionMock = mocked(GenericMessageSection, true);
    let sendPageViewSpy: jest.SpyInstance;
    let sendEventsSpy: jest.SpyInstance;
    
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

        getErrorTermMock.mockReturnValueOnce('Session expired');
        headerMock.mockReturnValueOnce(<div className="header">Header</div>);
        genericMessageSectionMock.mockReturnValueOnce(<div className="message">Message</div>);
        footerMock.mockReturnValueOnce(<div className="footer">Footer</div>);
        
        const props: ISessionExpiredPageProps = { closeModal: jest.fn() };
        const { container } = render(
            <Provider store={store}>
                <SessionExpiredPage {...props} />
            </Provider>
        );

        expect(container.getElementsByClassName('checkout-experience-container')).toHaveLength(1);
        expect(container.getElementsByClassName('buy-now-container')).toHaveLength(1);
        expect(container.getElementsByClassName('buy-now')).toHaveLength(1);
        expect(container.getElementsByClassName('header')).toHaveLength(1);
        expect(container.getElementsByClassName('message')).toHaveLength(1);
        expect(container.getElementsByClassName('footer').length).toBe(1);
        
        expect(headerMock).toHaveBeenCalledWith({isMobile: false}, emptyRef);
        expect(genericMessageSectionMock).toHaveBeenCalledWith(expect.objectContaining({
            messageTitle: 'Session expired',
            messageText: 'Close this modal and try again',
        }), emptyRef);
        expect(footerMock).toHaveBeenCalledWith(expect.objectContaining({
            nextButtonText: 'Close modal',
            nextButtonOnClick: props.closeModal,
        }), emptyRef);

        expect(sendPageViewSpy).toHaveBeenCalled();
        expect(sendEventsSpy).toHaveBeenCalled();
    });
});
