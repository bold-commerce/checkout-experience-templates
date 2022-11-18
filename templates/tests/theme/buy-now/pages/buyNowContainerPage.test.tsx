import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { BuyNowContainerPage } from 'src/themes/buy-now/pages';
import { useBuyNowContainerPage } from 'src/themes/buy-now/hooks';
import React from 'react';
import { IUseBuyNowContainerPage } from 'src/themes/buy-now/types';
import { useGetFlashErrors } from 'src/hooks';
import { IError } from 'src/types';

jest.mock('src/hooks/useGetFlashErrors');
jest.mock('src/themes/buy-now/hooks/useBuyNowContainerPage');
jest.mock('src/themes/buy-now/pages', () => ({
    ...jest.requireActual('src/themes/buy-now/pages'),
    IndexPage: () => <div className="mockIndex" />,
    ShippingPage: () => <div className="mockShipping" />,
    SummaryPage: () => <div className="mockSummary" />
}));
jest.mock('react', () => {
    const originReact = jest.requireActual('react');
    const mUseRef = jest.fn();
    return {
        ...originReact,
        useRef: mUseRef,
    };
});

const useBuyNowContainerPageMock = mocked(useBuyNowContainerPage, true);
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);

describe('testing BuyNowContainerPage', () => {
    const props: IUseBuyNowContainerPage = {
        openSection: '/',
        navigateTo: jest.fn(),
        containerStyle: {}
    };

    const error: IError = {
        message: 'error message',
        type: 'test-type',
        field: 'test',
        severity: 'validation',
        sub_type: '',
    };

    beforeEach(() => {
        useBuyNowContainerPageMock.mockReturnValue(props);
    });

    test('Rendering buyNowContainerPage properly', () => {
        useGetFlashErrorsMock.mockReturnValueOnce([]);
        const { container } = render(<BuyNowContainerPage />);

        expect(container.getElementsByClassName('checkout-experience-container').length).toBe(1);
        expect(container.getElementsByClassName('buy-now-container').length).toBe(1);
        expect(container.getElementsByClassName('mockIndex').length).toBe(1);
        expect(container.getElementsByClassName('mockShipping').length).toBe(1);
        expect(props.navigateTo).toHaveBeenCalledTimes(0);
    });

    test('Render buyNowContainerPage with flash errors', () => {
        useGetFlashErrorsMock.mockReturnValueOnce([{ message: 'error', error: error }, { message: 'error-2', error: error }]);
        render(<BuyNowContainerPage />);

        expect(props.navigateTo).toHaveBeenCalledTimes(1);
    });
});
