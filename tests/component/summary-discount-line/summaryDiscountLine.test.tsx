import {ISummaryDiscountLine, ISummaryDiscountLineProps} from 'src/types';
import {fireEvent, render, screen} from '@testing-library/react';
import {SummaryDiscountLine} from 'src/components';
import {mocked} from 'jest-mock';
import {useSummaryDiscountLine} from 'src/hooks';
import { getTerm } from 'src/utils';

jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/utils/getTerm');
const useSummaryDiscountLineMock = mocked(useSummaryDiscountLine, true);
const getTermMock = mocked(getTerm, true);

describe('Testing SummaryDiscountLine component', () => {
    const props: ISummaryDiscountLineProps = {
        code: 'TEST',
        amount: 5,
        source: '',
    };

    const hookResult: ISummaryDiscountLine = {
        discountCloseLoading: false,
        deleteElementFromState: jest.fn(),
        isLoading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValueOnce('applied_discount').mockReturnValueOnce('delete_discount');
    });

    test('rendering the component', () => {
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResult);

        const {container} = render(<SummaryDiscountLine {...props} />);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-code-value').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__delete-discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-code-price').length).toBe(1);
        expect(container.getElementsByClassName('discount_code--price').length).toBe(1);
    });

    test('rendering the component with loading', () => {
        const localProps = {...hookResult};
        localProps.discountCloseLoading = true;
        useSummaryDiscountLineMock.mockReturnValueOnce(localProps);

        const {container} = render(<SummaryDiscountLine {...props} />);
        expect(container.getElementsByClassName('discount-code__spinner-div').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__spinner').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__delete-discount-code').length).toBe(0);
    });

    test('rendering the component with isloading', () => {
        const localProps = {...hookResult};
        localProps.isLoading = true;
        useSummaryDiscountLineMock.mockReturnValueOnce(localProps);

        const {container} = render(<SummaryDiscountLine {...props} />);
        expect(container.getElementsByClassName('discount-code__spinner-div').length).toBe(0);
        expect(container.getElementsByClassName('discount-code__spinner').length).toBe(0);
        expect(container.getElementsByClassName('discount-code__delete-discount-code').length).toBe(0);
    });

    test('rendering the component with source not empty string', () => {
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResult);

        const sourceProps = {...props, source: 'some_source'};
        const {container} = render(<SummaryDiscountLine {...sourceProps} />);
        expect(container.getElementsByClassName('discount-code__spinner-div').length).toBe(0);
        expect(container.getElementsByClassName('discount-code__spinner').length).toBe(0);
        expect(container.getElementsByClassName('discount-code__delete-discount-code').length).toBe(1);
    });

    test('rendering the component with source = "cart"', () => {
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResult);

        const sourceProps = {...props, source: 'cart'};
        const {container} = render(<SummaryDiscountLine {...sourceProps} />);
        expect(container.getElementsByClassName('discount-code__spinner-div').length).toBe(0);
        expect(container.getElementsByClassName('discount-code__spinner').length).toBe(0);
        expect(container.getElementsByClassName('discount-code__delete-discount-code').length).toBe(0);
    });

    test('calling the on click event ', () => {
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResult);

        render(<SummaryDiscountLine {...props} />);
        const input = screen.getByTestId('delete-discount');
        fireEvent.click(input);
        expect(hookResult.deleteElementFromState).toHaveBeenCalled();
    });

});
