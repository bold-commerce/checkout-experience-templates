import {fireEvent, render, screen} from '@testing-library/react';
import {ShippingPage} from 'src/themes/buy-now/pages';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import React from 'react';
import { IBuyNowContainerPageProps, IUseShippingPage } from 'src/themes/buy-now/types';
import { useShippingPage } from 'src/themes/buy-now/hooks';
import { mocked } from 'jest-mock';

const store = Store.initializeStore();

jest.mock('src/themes/buy-now/hooks/useShippingPage');
const useShippingPageMock = mocked(useShippingPage, true);

describe('testing ShippingPage', () => {
    const visibleProps: IBuyNowContainerPageProps = {
        show: true,
        navigateTo: jest.fn()
    };

    const hiddenProps: IBuyNowContainerPageProps = {
        show: false,
        navigateTo: jest.fn()
    }

    const useShippingPageValue: (valid: boolean) => IUseShippingPage = (valid) => {
        return {
            closeBuyNow: jest.fn(),
            flashText: 'test text',
            stopBack: !(valid),
            setStopBack: jest.fn(),
            isValidAddress: valid
        }
    }

    beforeEach(() => {
        jest.resetAllMocks();
    })

    test('Rendering hidden shippingPage properly', () => { 
        useShippingPageMock.mockReturnValue(useShippingPageValue(true));
            
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
        useShippingPageMock.mockReturnValue(useShippingPageValue(true));

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

    test('firing click event on navigation with valid address', () => {
        useShippingPageMock.mockReturnValue(useShippingPageValue(true));

        const { container } = render(
            <Provider store={store}>
                <ShippingPage {...visibleProps}/>
            </Provider>
        );
        
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(0);
        const link = screen.getByTestId('navigation');
        fireEvent.click(link);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('flash-error__text').length).toBe(0);
    });

    test('firing click event on navigation with invalid address', () => {
        useShippingPageMock.mockReturnValue(useShippingPageValue(false));

        const { container } = render(
            <Provider store={store}>
                <ShippingPage {...visibleProps}/>
            </Provider>
        );
        
        const link = screen.getByTestId('navigation');
        fireEvent.click(link);

        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(0);
        expect(container.getElementsByClassName('flash-error__text').length).toBe(1);
    });
});
