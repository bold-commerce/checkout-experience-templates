import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThankYouPage } from 'src/themes/buy-now/pages';
import { initialDataMock } from 'src/mocks';
import { mocked } from 'jest-mock';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';

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
const useGetCloseBuyNowMock = mocked(useGetCloseBuyNow, true);

describe('testing the thank you page', () => {
    const closeModalMock = jest.fn();
    const shopUrl = 'test-shop.alias.com';

    beforeEach(() => {
        jest.clearAllMocks();
        window.shopAlias = shopUrl;
        useGetCloseBuyNowMock.mockReturnValue(closeModalMock);
    });

    test('render thank you page properly', () => {
        const { container } = render(<ThankYouPage />);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__order-recap').length).toBe(1);
        expect(container.getElementsByClassName('thank-you').length).toBe(1);
        expect(container.getElementsByClassName('thank-you__message').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);
    });

    test('test the continue shopping button', () => {
        render(<ThankYouPage/>);
        const button = screen.getByTestId('continue-shopping');
        fireEvent.click(button);
        expect(closeModalMock).toHaveBeenCalled();
    });
});