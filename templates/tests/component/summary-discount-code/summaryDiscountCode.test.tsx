import {fireEvent, render} from '@testing-library/react';
import {SummaryDiscountCode} from 'src/components';
import {ISummaryDiscountLine} from 'src/types';
import {mocked} from 'jest-mock';
import {
    useGetFlashErrors,
    useGetIsLoading,
    useSummaryDiscountCode,
    useSummaryDiscountLine
} from 'src/hooks';
import {IDiscount} from '@bold-commerce/checkout-frontend-library';
import {getTerm} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/hooks/useSummaryDiscountCode');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetFlashErrors');
jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
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
        useGetIsLoadingMock.mockReturnValue(false);
        useGetFlashErrorsMock.mockReturnValue([]);
        getTermMock.mockReturnValue('applied_discount').mockReturnValue('delete_discount');
    });

    test('rendering the component', () => {
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
        useSummaryDiscountCodeMock.mockReturnValueOnce({...hooksData, buttonDisabled: true, discountCodeText: ''});
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
