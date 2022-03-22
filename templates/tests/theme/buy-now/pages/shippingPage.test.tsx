import {fireEvent, render, screen} from '@testing-library/react';
import {ShippingPage} from 'src/themes/buy-now/pages';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import React from 'react';
import { IBuyNowContainerPageProps } from 'src/themes/buy-now/types';

const store = Store.initializeStore();

describe('testing ShippingPage', () => {
    const visibleProps: IBuyNowContainerPageProps = {
        show: true,
        navigateTo: jest.fn()
    };

    const hiddenProps: IBuyNowContainerPageProps = {
        show: false,
        navigateTo: jest.fn()
    }

    test('Rendering hidden shippingPage properly', () => { 
        const {container} = render(
            <Provider store={store}>
                <ShippingPage {...hiddenProps}/>
            </Provider>
        );
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary--closed').length).toBe(1);
        expect(container.getElementsByClassName('shipping-page').length).toBe(1);
    });


    test('Rendering visible shippingPage properly', () => {
        const {container} = render(
            <Provider store={store}>
                <ShippingPage {...visibleProps}/>
            </Provider>
        );
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary--open').length).toBe(1);
        expect(container.getElementsByClassName('shipping-page').length).toBe(1);
    });

    test('firing click event on navigation', () => {

        render(
            <Provider store={store}>
                <ShippingPage {...visibleProps}/>
            </Provider>
        );
        
        const link = screen.getByTestId('navigation');
        fireEvent.click(link);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);

    });
});
