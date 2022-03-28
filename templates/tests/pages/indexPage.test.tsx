import { fireEvent, render, screen } from '@testing-library/react';
import { IndexPage } from 'src/themes/buy-now/pages';
import { IUseIndexPageProps } from 'src/types';
import { addressMock } from 'src/mocks';
import { getTerm } from 'src/utils';
import { mocked } from 'ts-jest/utils';
import { useGetSelectShippingLine } from 'src/hooks';
import * as useIndexPage from 'src/hooks/useIndexPage';
import { IBuyNowContainerPageProps } from 'src/themes/buy-now/types';
import * as Store from 'src/store';
import { Provider } from 'react-redux';

const store = Store.initializeStore();

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetSelectShippingLine');
const getTermMock = mocked(getTerm, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);


describe('testing IndexPage', () => {
    const getTermValue = 'test term';
    const selectShippingLineValue = {
        id: '1',
        amount: 99,
        description: 'test shipping'
    }
    
    const visibleProps: IBuyNowContainerPageProps = {
        show: true,
        navigateTo: jest.fn()
    };

    const hiddenProps: IBuyNowContainerPageProps = {
        show: false,
        navigateTo: jest.fn()
    }

    const propsFromHook: IUseIndexPageProps = {
        loginUrl: jest.fn(),
        loginText: 'login',
        orderTotal: 8888,
        websiteName: 'test store',
        lineItems: [],
        summaryHeadingText: getTermValue,
        email: 'test@email.gg',
        shippingHeadingText: getTermValue,
        address: addressMock,
        paymentHeadingText: getTermValue,
        checkoutOnClick: jest.fn()
    }

    const useIndexPageSpy = jest.spyOn(useIndexPage, 'useIndexPage');

    beforeEach(() => {
        jest.clearAllMocks();
        useIndexPageSpy.mockReturnValue(propsFromHook);
        getTermMock.mockReturnValue(getTermValue);
        useGetSelectShippingLineMock.mockReturnValue(selectShippingLineValue);
    });
    
    test('Rendering visible indexPage properly', () => {
        const {container} = render(
            <Provider store={store}>
                <IndexPage {...visibleProps}/>
            </Provider>
        );

        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now--open').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__index-header').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__products').length).toBe(1);
        expect(container.getElementsByClassName('cart-items').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__section').length).toBe(4);
        expect(container.getElementsByClassName('condensed-shipping__name').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);
    });

    test('Rendering hidden indexPage properly', () => {
        const {container} = render(
            <Provider store={store}>
                <IndexPage {...hiddenProps}/>
            </Provider>
        );

        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now--closed').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__index-header').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__products').length).toBe(1);
        expect(container.getElementsByClassName('cart-items').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__section').length).toBe(4);
        expect(container.getElementsByClassName('condensed-shipping__name').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__checkout-button').length).toBe(1);
    });

    test('firing click event to summary page', () => {
        render(
            <Provider store={store}>
                <IndexPage {...visibleProps}/>
            </Provider>
        );
        
        const link = screen.getAllByTestId('navigation');
        fireEvent.click(link[0]);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/summary');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);

    });

    test('firing click event to shipping page', () => {
        render(
            <Provider store={store}>
                <IndexPage {...visibleProps}/>
            </Provider>
        );
        
        const link = screen.getAllByTestId('navigation');
        fireEvent.click(link[1]);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/shipping');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);

    });
});