import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { OutOfStockPage } from 'src/themes/buy-now/pages';
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

describe('testing the out of stock page', () => {
    const closeModalMock = jest.fn();


    beforeEach(() => {
        jest.clearAllMocks();
        useGetCloseBuyNowMock.mockReturnValue(closeModalMock);
    });

    test('render out of stock page properly', () => {
        const { container } = render(<OutOfStockPage />);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock').length).toBe(1);
        expect(container.getElementsByClassName('out-of-stock__message').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);
    });

    test('test the return to product button', () => {
        render(<OutOfStockPage/>);
        const button = screen.getByTestId('return-to-product');
        fireEvent.click(button);
        expect(closeModalMock).toHaveBeenCalled();
    });
});