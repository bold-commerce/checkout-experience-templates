import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { OutOfStockPage } from 'src/themes/buy-now/pages';
import { initialDataMock } from 'src/mocks';
import { mocked } from 'jest-mock';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { IUseFocusTrap, IUseGetCloseBuyNow } from 'src/themes/buy-now/types';
import { sendPageView, sendEvents } from 'src/analytics/analytics';
import { useFocusTrap } from 'src/themes/buy-now/hooks/useFocusTrap';
import { getReturnToCartTermAndLink } from 'src/utils';

const store = {
    data: initialDataMock,
    appSetting: { autocompleteService: 'test' },
    isValid: { orderProcessed: true }
};

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => jest.fn()
}));

jest.mock('src/analytics/analytics');
jest.mock('src/themes/buy-now/hooks/useGetCloseBuyNow');
jest.mock('src/themes/buy-now/hooks/useGetCloseBuyNow');
jest.mock('src/themes/buy-now/hooks/useFocusTrap');
jest.mock('src/utils/getReturnToCartTermAndLink');
const useGetCloseBuyNowMock = mocked(useGetCloseBuyNow, true);
const useFocusTrapMock = mocked(useFocusTrap, true);
const sendPageViewMock = mocked(sendPageView, true);
const sendEventsMock = mocked(sendEvents, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);

describe('testing the out of stock page', () => {
    const closeModalMock: IUseGetCloseBuyNow = {
        closeBuyNow: jest.fn(),
        websiteName: 'websiteName',
        terms: {},
        loginUrl: jest.fn()
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

    beforeEach(() => {
        jest.clearAllMocks();
        useGetCloseBuyNowMock.mockReturnValue(closeModalMock);
        useFocusTrapMock.mockReturnValueOnce(focusTrapMock);
        getReturnToCartTermAndLinkMock.mockReturnValue({ term: 'return_to_cart', link: 'test-shop.alias.com' });
    });

    test('render out of stock page properly', () => {
        const { container } = render(<OutOfStockPage />);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock__message').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);

        expect(sendPageViewMock).toHaveBeenCalled();
        expect(sendEventsMock).toHaveBeenCalled();
    });

    test('test the return to product button', () => {
        render(<OutOfStockPage />);
        const button = screen.getByTestId('return-to-product');
        fireEvent.click(button);
        expect(closeModalMock.closeBuyNow).toHaveBeenCalled();
    });
});
