import { fireEvent, render, screen } from '@testing-library/react';
import { SummaryPage } from 'src/themes/buy-now/pages';
import { addressMock, storeMock } from 'src/mocks';
import { mocked } from 'jest-mock';
import React from 'react';
import { IBuyNowContainerPageProps, IUseFocusTrap } from 'src/themes/buy-now/types';
import { useIndexPage } from 'src/themes/buy-now/hooks/useIndexPage';
import { IUseIndexPageProps } from 'src/types';
import { useFocusTrap } from 'src/themes/buy-now/hooks';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/themes/buy-now/hooks/useFocusTrap');
jest.mock('src/themes/buy-now/hooks/useIndexPage');
const useFocusTrapMock = mocked(useFocusTrap, true);
const useIndexPageMock = mocked(useIndexPage, true);

describe('testing SummaryPage', () => {
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
        summaryHeadingText: 'summary',
        email: 'test@email.gg',
        shippingHeadingText: 'shipping',
        address: addressMock,
        shippingIssueLinkText: 'shipping issue link',
        shippingIssueText: 'shipping issue',
        paymentHeadingText: 'payment',
        quantityDisabled: false,
        checkoutOnClick: jest.fn(),
        updateLineItemQuantity: jest.fn(),
    };

    beforeEach(() => {
        useIndexPageMock.mockReturnValue(propsFromHook);
        useFocusTrapMock.mockReturnValueOnce(focusTrapMock);
    });

    test('Rendering hidden summaryPage properly', () => {
        const { container } = render(<SummaryPage {...hiddenProps} />);
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary--closed').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__summary').length).toBe(1);
    });


    test('Rendering visible summaryPage properly', () => {
        const { container } = render(
            <SummaryPage {...visibleProps} />
        );
        expect(container.getElementsByClassName('buy-now').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__secondary--open').length).toBe(1);
        expect(container.getElementsByClassName('buy-now__summary').length).toBe(1);
    });

    test('firing click event on navigation', () => {

        render(
            <SummaryPage {...visibleProps} />
        );

        const link = screen.getByTestId('navigation');
        fireEvent.click(link);

        expect(visibleProps.navigateTo).toHaveBeenCalledWith('/');
        expect(visibleProps.navigateTo).toHaveBeenCalledTimes(1);

    });

    test('firing click event on complete order button', () => {
        render(
            <SummaryPage {...visibleProps} />
        );

        const link = screen.getByTestId('complete_order');
        fireEvent.click(link);

        expect(propsFromHook.checkoutOnClick).toHaveBeenCalledTimes(1);
    });
});
