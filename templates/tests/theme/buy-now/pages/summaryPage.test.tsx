import {fireEvent, render, screen} from '@testing-library/react';
import {SummaryPage} from 'src/themes/buy-now/pages';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import { addressMock } from 'src/mocks';
import React from 'react';
import { IBuyNowContainerPageProps } from 'src/themes/buy-now/types';
import * as useIndexPage from 'src/hooks/useIndexPage';
import { IUseIndexPageProps } from 'src/types';

const store = Store.initializeStore();

describe('testing SummaryPage', () => {
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
        summaryHeadingText: 'summary',
        email: 'test@email.gg',
        shippingHeadingText: 'shipping',
        address: addressMock,
        paymentHeadingText: 'payment',
        checkoutOnClick: jest.fn()
    };
    
    const useIndexPageSpy = jest.spyOn(useIndexPage, 'useIndexPage');

    beforeEach(() => {
        useIndexPageSpy.mockReturnValue(propsFromHook);
    })

    test('Rendering hidden summaryPage properly', () => { 
        const {container} = render(
            <Provider store={store}>
                <SummaryPage {...hiddenProps}/>
            </Provider>
        );
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary--closed').length).toBe(1);
        expect(container.getElementsByClassName('summary-page').length).toBe(1);
    });


    test('Rendering visible summaryPage properly', () => {
        const {container} = render(
            <Provider store={store}>
                <SummaryPage {...visibleProps}/>
            </Provider>
        );
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary--open').length).toBe(1);
        expect(container.getElementsByClassName('summary-page').length).toBe(1);
    });

    test('firing click event on navigation', () => {

        render(
            <Provider store={store}>
                <SummaryPage {...visibleProps}/>
            </Provider>
        );
        
        const link = screen.getByTestId('navigation');
        fireEvent.click(link);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);

    });

    test('firing click event on complete order button', () => {
        render(
            <Provider store={store}>
                <SummaryPage {...visibleProps}/>
            </Provider>
        );
        
        const link = screen.getByTestId('complete_order');
        fireEvent.click(link);

        expect(propsFromHook.checkoutOnClick).toHaveBeenCalledTimes(1);
    });
});
