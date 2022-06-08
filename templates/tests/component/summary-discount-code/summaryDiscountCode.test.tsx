import {fireEvent, render} from '@testing-library/react';
import {SummaryDiscountCode} from 'src/components';
import {IApplicationStateDiscount, ISummaryDiscountLine} from 'src/types';
import {mocked} from 'jest-mock';
import {useSummaryDiscountCode, useSummaryDiscountLine} from 'src/hooks';

jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/hooks/useSummaryDiscountCode');
const useSummaryDiscountLineMock = mocked(useSummaryDiscountLine, true);
const useSummaryDiscountCodeMock = mocked(useSummaryDiscountCode, true);

describe('Testing SummaryDiscountCode Component', () => {
    const discounts : Array<IApplicationStateDiscount> = [
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
        updateNewDiscountCode: jest.fn()
    };

    const hookResultForDiscountLine: ISummaryDiscountLine= {
        discountCloseLoading: false,
        deleteElementFromState: jest.fn(),
        isLoading: false,
    };

    beforeEach(() => {
        useSummaryDiscountCodeMock.mockReturnValue(hooksData);
        useSummaryDiscountLineMock.mockReturnValue(hookResultForDiscountLine);
    });

    test('rendering the component', () => {
        const {container, getByTestId} = render(<SummaryDiscountCode />);
        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        const applyDiscount: Partial<HTMLInputElement> = getByTestId('apply-discount');
        expect(applyDiscount.disabled).toEqual(false);
        expect(container.getElementsByClassName('discount-code__list-discounts').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(discounts.length);
    });

    test('rendering the component with null value', () => {
        useSummaryDiscountCodeMock.mockReturnValueOnce({...hooksData, buttonDisabled: true, discountCodeText: ''});
        const {container, getByTestId} = render(<SummaryDiscountCode />);
        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        const applyDiscount: Partial<HTMLInputElement> = getByTestId('apply-discount');
        expect(applyDiscount.disabled).toEqual(true);
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
