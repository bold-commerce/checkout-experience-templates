import {fireEvent, render} from '@testing-library/react';
import {SummaryDiscountCode} from 'src/components';
import {ISummaryDiscountLine} from 'src/types';
import {mocked} from 'jest-mock';
import {
    useGetFlashErrors,
    useGetIsLoadingExceptSections,
    useSummaryDiscountCode,
    useSummaryDiscountLine
} from 'src/hooks';
import {IDiscount} from '@boldcommerce/checkout-frontend-library';
import {getTerm} from 'src/utils';
import React from 'react';

const mockDispatch = jest.fn();
jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/hooks/useSummaryDiscountCode');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetFlashErrors');
jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useSummaryDiscountLineMock = mocked(useSummaryDiscountLine, true);
const useSummaryDiscountCodeMock = mocked(useSummaryDiscountCode, true);
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing SummaryDiscountCode Component', () => {
    const discounts : Array<IDiscount> = [
        {
            code: 'test',
            text: 'test-text',
            value: 5,
            valid: true
        }
    ];
    const hooksData = {
        discounts: discounts,
        discountCodeText: 'TEST',
        discountError: '',
        buttonLoading: false,
        buttonDisabled: false,
        discountCodeInputText: 'test-value',
        addDiscount: jest.fn(),
        updateNewDiscountCode: jest.fn(),
        ariaLabel: '',
        ariaLive: ''
    };

    const hookResultForDiscountLine: ISummaryDiscountLine= {
        discountCloseLoading: false,
        deleteElementFromState: jest.fn(),
        isLoading: false,
    };

    beforeEach(() => {
        useSummaryDiscountCodeMock.mockReturnValue(hooksData);
        useSummaryDiscountLineMock.mockReturnValue(hookResultForDiscountLine);
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
        useGetFlashErrorsMock.mockReturnValue([]);
    });

    test('rendering the component', () => {
        getTermMock.mockImplementation((term) => term);
        const {container, getByTestId} = render(<SummaryDiscountCode />);
        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        const applyDiscount = getByTestId('apply-discount');
        expect(applyDiscount?.getAttribute('aria-disabled')).toEqual('false');
        expect(container.getElementsByClassName('discount-code__list-discounts').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(discounts.length);
    });

    test('rendering the component with source else than cart', () => {
        const hooksDataWithSource = {...hooksData};
        hooksDataWithSource.discounts[0].source = 'some_source';
        useSummaryDiscountCodeMock.mockReturnValue(hooksDataWithSource);

        getTermMock.mockImplementation((term) => term);
        const {container, getByTestId} = render(<SummaryDiscountCode />);
        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        const applyDiscount = getByTestId('apply-discount');
        expect(applyDiscount?.getAttribute('aria-disabled')).toEqual('false');
        expect(container.getElementsByClassName('discount-code__list-discounts').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(discounts.length);
    });

    test('rendering the component with source = cart', () => {
        const hooksDataWithSource = {...hooksData};
        hooksDataWithSource.discounts[0].source = 'cart';
        useSummaryDiscountCodeMock.mockReturnValue(hooksDataWithSource);

        getTermMock.mockImplementation((term) => term);
        const {container, getByTestId} = render(<SummaryDiscountCode />);
        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        const applyDiscount = getByTestId('apply-discount');
        expect(applyDiscount?.getAttribute('aria-disabled')).toEqual('false');
        expect(container.getElementsByClassName('discount-code__list-discounts').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(discounts.length);
    });

    test('rendering the component with null value', () => {
        getTermMock.mockImplementation((term) => term);
        useSummaryDiscountCodeMock.mockReturnValue({...hooksData, buttonDisabled: true, discountCodeText: ''});
        const {container, getByTestId} = render(<SummaryDiscountCode />);
        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        const applyDiscount = getByTestId('apply-discount');
        expect(applyDiscount?.getAttribute('aria-disabled')).toEqual('true');
        expect(container.getElementsByClassName('discount-code__list-discounts').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(discounts.length);
    });

    test('firing the click event of apply button', () => {
        const {getByTestId} = render(<SummaryDiscountCode />);
        const input = getByTestId('apply-discount');
        fireEvent.click(input);

        expect(hooksData.addDiscount).toHaveBeenCalled();
    });

});
