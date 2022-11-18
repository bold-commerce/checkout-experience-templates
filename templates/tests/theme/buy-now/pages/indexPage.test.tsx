import { fireEvent, render, screen } from '@testing-library/react';
import { IndexPage } from 'src/themes/buy-now/pages';
import { IUseIndexPageProps } from 'src/types';
import { addressMock } from 'src/mocks';
import { getTerm } from 'src/utils';
import { mocked } from 'jest-mock';
import { useGetOverlayVisible, useGetSelectShippingLine } from 'src/hooks';
import { useIndexPage } from 'src/themes/buy-now/hooks/useIndexPage';
import { IBuyNowContainerPageProps, IUseFocusTrap } from 'src/themes/buy-now/types';
import * as Store from 'src/store';
import { Provider } from 'react-redux';
import { useCheckShippingAddress } from 'src/themes/buy-now/hooks';
import { useFocusTrap } from 'src/themes/buy-now/hooks';

const store = Store.initializeStore();

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetOverlayVisible');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/themes/buy-now/hooks/useCheckShippingAddress');
jest.mock('src/themes/buy-now/hooks/useFocusTrap');
jest.mock('src/themes/buy-now/hooks/useIndexPage');
const getTermMock = mocked(getTerm, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const useCheckShippingAddressMock = mocked(useCheckShippingAddress);
const useFocusTrapMock = mocked(useFocusTrap, true);
const useIndexPageMock = mocked(useIndexPage, true);
const useGetOverlayVisibleMock = mocked(useGetOverlayVisible, true);

describe('testing IndexPage', () => {
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
    const getTermValue = 'test term';
    const selectShippingLineValue = {
        id: '1',
        amount: 99,
        description: 'test shipping'
    };

    const visibleProps: IBuyNowContainerPageProps = {
        show: true,
        navigateTo: jest.fn()
    };

    const hiddenProps: IBuyNowContainerPageProps = {
        show: false,
        navigateTo: jest.fn()
    };

    const propsFromHook: IUseIndexPageProps = {
        loginText: 'login',
        orderTotal: 8888,
        lineItems: [],
        summaryHeadingText: getTermValue,
        email: 'test@email.gg',
        shippingHeadingText: getTermValue,
        address: addressMock,
        paymentHeadingText: getTermValue,
        shippingIssueLinkText: 'shipping issue link text',
        shippingIssueText: 'shipping issue test',
        quantityDisabled: false,
        checkoutOnClick: jest.fn(),
        updateLineItemQuantity: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useFocusTrapMock.mockReturnValueOnce(focusTrapMock);
        useIndexPageMock.mockReturnValue(propsFromHook);
        getTermMock.mockReturnValue(getTermValue);
        useGetSelectShippingLineMock.mockReturnValue(selectShippingLineValue);
        useCheckShippingAddressMock.mockReturnValue({ isValid: true });
        useGetOverlayVisibleMock.mockReturnValue(false);
    });

    test('Rendering visible indexPage properly', () => {
        const { container } = render(
            <Provider store={store}>
                <IndexPage {...visibleProps} />
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
        const { container } = render(
            <Provider store={store}>
                <IndexPage {...hiddenProps} />
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

    test('Rendering with shipping error', () => {
        useCheckShippingAddressMock.mockReturnValue({ isValid: false });

        const { container, getByText } = render(
            <Provider store={store}>
                <IndexPage {...visibleProps} />
            </Provider>
        );

        expect(container.querySelector('.flash-error')).toBeTruthy();
        expect(getByText(propsFromHook.shippingIssueText)).toBeTruthy();
        expect(getByText(propsFromHook.shippingIssueLinkText)).toBeTruthy();

        const shippingIssueLink = getByText(propsFromHook.shippingIssueLinkText);
        fireEvent.click(shippingIssueLink);

        expect(visibleProps.navigateTo).toBeCalledTimes(1);
    });

    test('firing click event to summary page', () => {
        render(
            <Provider store={store}>
                <IndexPage {...visibleProps} />
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
                <IndexPage {...visibleProps} />
            </Provider>
        );

        const link = screen.getAllByTestId('navigation');
        fireEvent.click(link[1]);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/shipping');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);
    });
});
