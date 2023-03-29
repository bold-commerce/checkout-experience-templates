import {fireEvent, render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {
    useExpandableDiscount,
    useGetFlashErrors,
    useGetIsLoadingExceptSections,
    useSummaryDiscountCode,
    useSummaryDiscountLine
} from 'src/hooks';
import { ExpandableDiscount } from 'src/components';
import { ISummaryDiscountLine } from 'src/types';
import {getTerm} from 'src/utils';

const mockDispatch = jest.fn();

jest.mock('src/hooks/useExpandableDiscount');
jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/hooks/useSummaryDiscountCode');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetFlashErrors');
jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useExpandableDiscountMock = mocked(useExpandableDiscount, true);
const useSummaryDiscountLineMock = mocked(useSummaryDiscountLine, true);
const useSummaryDiscountCodeMock = mocked(useSummaryDiscountCode, true);
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

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
        jest.resetAllMocks();
        useSummaryDiscountCodeMock.mockReturnValueOnce(hookResultForDiscountCode);
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResultForDiscountLine);
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
        useGetFlashErrorsMock.mockReturnValue([]);
        getTermMock.mockReturnValueOnce('discount_code_successfully_applied');
    });

    test('rendering the component', () => {
        useExpandableDiscountMock.mockReturnValueOnce(hooksData);

        const {container} = render(<ExpandableDiscount />);

        expect(container.getElementsByClassName('expandable-discount__toggle').length).toBe(1);
    });

    test('render expanded component', () => {
        useExpandableDiscountMock.mockReturnValueOnce({...hooksData, expandDiscount: true});

        const {container, getByTestId} = render(<ExpandableDiscount />);

        expect(container.getElementsByClassName('expandable-discount__toggle').length).toBe(0);
        expect(getByTestId('discount-code-input-field')).toBeTruthy();
        expect(getByTestId('apply-discount')).toBeTruthy();
    });

    test('firing the click event of the expand discount button', async () => {
        useExpandableDiscountMock.mockReturnValueOnce(hooksData);

        const {getByTestId} = render(<ExpandableDiscount />);

        const button = getByTestId('discount-toggle');
        fireEvent.click(button);
        expect(hooksData.toggleDiscount).toHaveBeenCalled();
    });
});
