import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThankYouPage } from 'src/themes/buy-now/pages';
import { initialDataMock } from 'src/mocks';
import { mocked } from 'jest-mock';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { IUseFocusTrap, IUseGetCloseBuyNow } from 'src/themes/buy-now/types';
import * as analytics from 'src/analytics/analytics';
import { useFocusTrap } from 'src/themes/buy-now/hooks/useFocusTrap';

const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    isValid: {orderProcessed: true}
};

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => jest.fn()
}));

jest.mock('src/themes/buy-now/hooks/useGetCloseBuyNow');
jest.mock('src/themes/buy-now/hooks/useFocusTrap');
const useGetCloseBuyNowMock = mocked(useGetCloseBuyNow, true);
const useFocusTrapMock = mocked(useFocusTrap, true);

describe('testing the thank you page', () => {
    const closeModalMock: IUseGetCloseBuyNow = {
        closeBuyNow: jest.fn(),
        websiteName: 'websiteName',
        terms: {}
    };
    const focusTrapMock: IUseFocusTrap = {
        activeElement: 'thank_you',
        focusTrapOptions: {
            // NOTE: JSDom doesn't support some of the visibility checks that tabbable
            //  performs to determine if a node is visible (and so tabbable/focusable)
            //  so we have to use this displayCheck mode to run tests in this env
            tabbableOptions: {
                displayCheck: 'none'
            }
        }
    };
    const shopUrl = 'test-shop.alias.com';
    let sendPageViewSpy: jest.SpyInstance;
    let sendEventsSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        window.shopAlias = shopUrl;
        useGetCloseBuyNowMock.mockReturnValue(closeModalMock);
        useFocusTrapMock.mockReturnValueOnce(focusTrapMock);
        sendPageViewSpy = jest.spyOn(analytics, 'sendPageView');
        sendEventsSpy = jest.spyOn(analytics, 'sendEvents');
    });

    test('render thank you page properly', () => {
        const { container } = render(<ThankYouPage />);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__order-recap').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__message').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);

        expect(sendPageViewSpy).toHaveBeenCalled();
        expect(sendEventsSpy).toHaveBeenCalled();
    });

    test('test the continue shopping button', () => {
        render(<ThankYouPage/>);
        const button = screen.getByTestId('continue-shopping');
        fireEvent.click(button);
        expect(closeModalMock.closeBuyNow).toHaveBeenCalled();
    });
});