import {fireEvent, render} from '@testing-library/react';
import {mocked} from 'ts-jest/utils';
import { useExpandableDiscount, useSummaryDiscountCode, useSummaryDiscountLine} from 'src/hooks';
import { ExpandableDiscount } from 'src/components';
import { ISummaryDiscountLine } from 'src/types';
import '@testing-library/jest-dom/extend-expect';

jest.mock('src/hooks/useExpandableDiscount');
jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/hooks/useSummaryDiscountCode');

const useExpandableDiscountMock = mocked(useExpandableDiscount, true);
const useSummaryDiscountLineMock = mocked(useSummaryDiscountLine, true);
const useSummaryDiscountCodeMock = mocked(useSummaryDiscountCode, true);

describe('Testing ExpandableDiscount Component', () => {
    const hooksData = {
        expandDiscount: false, 
        toggleDiscount: jest.fn(),
        discountCodeInputText: 'TEST',
    };

    const hookResultForDiscountCode = {
        discounts: [],
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
        useExpandableDiscountMock.mockReturnValueOnce(hooksData).mockReturnValueOnce({...hooksData, expandDiscount: true}).mockReturnValue(hooksData);
        useSummaryDiscountCodeMock.mockReturnValueOnce(hookResultForDiscountCode);
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResultForDiscountLine);
    });

    test('rendering the component', () => {
        const {container} = render(<ExpandableDiscount />);
        expect(container.getElementsByClassName('expandable-discount__toggle').length).toBe(1);
    });

    test('render expanded component', () => {
        const {container, getByTestId} = render(<ExpandableDiscount />);
        expect(container.getElementsByClassName('expandable-discount__toggle').length).toBe(0);
        expect(getByTestId('input-field')).toBeVisible();
        expect(getByTestId('apply-discount')).toBeVisible();
    });

    test('firing the click event of the expand discount button', async () => {
        const {getByTestId} = render(<ExpandableDiscount />);
        const button = getByTestId('discount-toggle');
        fireEvent.click(button);
        expect(hooksData.toggleDiscount).toHaveBeenCalled();
    });
});
