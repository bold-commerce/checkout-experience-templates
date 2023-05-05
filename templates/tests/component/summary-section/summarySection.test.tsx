import {render} from '@testing-library/react';
import {SummarySection} from 'src/components';
import {ISummaryDiscountLine, IUseCartSummary} from 'src/types';
import {useCartSummary, useGetFlashErrors, useSummaryDiscountCode, useSummaryDiscountLine} from 'src/hooks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {initialDataMock} from 'src/mocks';
import {IDiscount} from '@boldcommerce/checkout-frontend-library';

const store = {
    data: initialDataMock
};
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useCartSummary');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useSummaryDiscountLine');
jest.mock('src/hooks/useSummaryDiscountCode');
jest.mock('src/hooks/useGetFlashErrors');
const useGetFlashErrorsMock = mocked(useGetFlashErrors, true);
const useCartSummaryMock = mocked(useCartSummary, true);
const getTermMock = mocked(getTerm, true);
const useSummaryDiscountLineMock = mocked(useSummaryDiscountLine, true);
const useSummaryDiscountCodeMock = mocked(useSummaryDiscountCode, true);

describe('Testing CartSummary component', () => {

    const hookResult: IUseCartSummary = {
        expandSummary: true,
        totals: 300,
        showSummary: true,
        toggleSummary: jest.fn(),
        lineItems: [],
        summaryAriaLabel: 'order summary',
    };

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
        jest.clearAllMocks();
        getTermMock.mockReturnValue('test');
        useGetFlashErrorsMock.mockReturnValue([]);
    });

    test('Rendering the component correctly - wider screen', () => {
        useCartSummaryMock.mockReturnValueOnce(hookResult);

        const {container} = render(<SummarySection orderCompleted={true}/>);

        expect(container.getElementsByClassName('summary-section')).toBeTruthy();
        expect(container.getElementsByClassName('summary__cart--expand').length).toBe(1);
        expect(container.getElementsByClassName('block__summary-cart--collapse').length).toBe(1);
        expect(container.getElementsByClassName('summary').length).toBe(1);
        expect(container.getElementsByClassName('summary__cart-title').length).toBe(1);
        expect(container.getElementsByClassName('cart-items').length).toBe(1);
    });

    test('Rendering the component correctly - small screen', () => {
        useCartSummaryMock.mockReturnValueOnce({...hookResult, expandSummary: false, showSummary: false});

        const {container} = render(<SummarySection orderCompleted={true}/>);

        expect(container.getElementsByClassName('summary-section')).toBeTruthy();
        expect(container.getElementsByClassName('summary__cart--expand').length).toBe(1);
        expect(container.getElementsByClassName('block__summary-cart--collapse').length).toBe(0);
        expect(container.getElementsByClassName('summary').length).toBe(1);
        expect(container.getElementsByClassName('summary__cart-title').length).toBe(1);
        expect(container.getElementsByClassName('cart-items').length).toBe(0);
    });

    test('Rendering the component correctly - order incomplete', () => {
        useCartSummaryMock.mockReturnValueOnce(hookResult);
        useSummaryDiscountCodeMock.mockReturnValueOnce(hooksData);
        useSummaryDiscountLineMock.mockReturnValueOnce(hookResultForDiscountLine);

        const {container} = render(<SummarySection orderCompleted={false}/>);

        expect(container.getElementsByClassName('summary-section')).toBeTruthy();
        expect(container.getElementsByClassName('summary__cart--expand').length).toBe(1);
        expect(container.getElementsByClassName('block__summary-cart--collapse').length).toBe(1);
        expect(container.getElementsByClassName('summary').length).toBe(1);
        expect(container.getElementsByClassName('summary__cart-title').length).toBe(1);
        expect(container.getElementsByClassName('cart-items').length).toBe(1);

        expect(container.getElementsByClassName('discount-code').length).toBe(1);
        expect(container.getElementsByClassName('discount-code-input').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__input-field').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__button').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__list-discounts').length).toBe(1);
        expect(container.getElementsByClassName('discount-code__discount-line').length).toBe(discounts.length);
    });
});
