import {mocked} from 'jest-mock';
import {getClassesListSummary, getTerm, getTotals} from 'src/utils';
import {
    useGetCurrencyInformation,
    useGetDiscounts,
    useGetLineItems,
    useGetPayments,
    useGetSelectShippingLine,
    useGetTaxes, useSummaryLineExpandable, useSummaryLineExpanded
} from 'src/hooks';
import {
    ITaxesAmount,
    ITotals,
    IUseGetCurrencyInformation,
    IUseSummaryLineExpandable,
    IUseSummaryLineExpanded
} from 'src/types';
import {classesListSummary, stateMock} from 'src/mocks';
import {render, screen} from '@testing-library/react';
import {TaxesAmount} from 'src/components';

jest.mock('src/hooks');
jest.mock('src/utils');
const useGetDiscountsMock = mocked(useGetDiscounts, true);
const useGetPaymentsMock = mocked(useGetPayments, true);
const useGetTaxesMock = mocked(useGetTaxes, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const getTotalsMock = mocked(getTotals, true);
const getTermMock = mocked(getTerm, true);
const getClassesListSummaryMock = mocked(getClassesListSummary, true);
const useSummaryLineExpandableMock = mocked(useSummaryLineExpandable, true);
const useSummaryLineExpandedMock = mocked(useSummaryLineExpanded, true);
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);

describe('Testing TaxesAmount component', () => {

    const props: ITaxesAmount= {
        orderCompleted: false
    };
    const appState = stateMock.data.application_state;
    const getTermResponse = ['discounts', 'payments', 'amount_remaining', 'subTotal', 'shipping', 'taxes', 'total',  ];
    const selectedShippingLine = {
        id: 'shipping_id_1',
        description: 'USPS ground carrier',
        amount: 1999
    };
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 0,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 0,
        totalDiscounts: 0
    };

    const useSummaryLineExpandableHookResult: IUseSummaryLineExpandable = {
        expand: true,
        classes: classesListSummary,
        toggle: jest.fn(),
        fieldNames: {content: 'test', amount: '200', id: '1'},
        formattedPrice: '${{amount}}'
    };

    const useSummaryLineExpandedHookResult: IUseSummaryLineExpanded = {
        textAlign: 'center',
        eventDeleteName: '',
        itemId: '',
        deleteElementFromState: jest.fn(),
        closeLoading: false,
        isLoading: false,
        formattedPrice: '${{amount}}'
    };
    const currencyData: IUseGetCurrencyInformation = {
        currency: 'CAD',
        currencySymbol: '$',
        formattedPrice: '${{amount}}'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetTaxesMock.mockReturnValue(appState.taxes);
        useGetSelectShippingLineMock.mockReturnValue(selectedShippingLine);
        useGetLineItemsMock.mockReturnValue(appState.line_items);
        getClassesListSummaryMock.mockReturnValue(classesListSummary);
        useSummaryLineExpandableMock.mockReturnValue(useSummaryLineExpandableHookResult);
        useSummaryLineExpandedMock.mockReturnValue(useSummaryLineExpandedHookResult);
        getTotalsMock.mockReturnValue(totals);
        useGetCurrencyInformationMock.mockReturnValue(currencyData);
    });

    test('Rendering the component properly', () => {
        getTermMock
            .mockReturnValueOnce(getTermResponse[0])
            .mockReturnValueOnce(getTermResponse[1])
            .mockReturnValueOnce(getTermResponse[2])
            .mockReturnValueOnce(getTermResponse[3])
            .mockReturnValueOnce(getTermResponse[4])
            .mockReturnValueOnce(getTermResponse[5])
            .mockReturnValueOnce(getTermResponse[6]);
        useGetDiscountsMock.mockReturnValueOnce(appState.discounts);
        useGetPaymentsMock.mockReturnValueOnce(appState.payments);

        const { container } = render(<TaxesAmount {...props}/>);
        expect(container.getElementsByClassName('taxes-amount').length).toBe(1);
        expect(screen.getAllByText(getTermResponse[0]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[1]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[2]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[3]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[4]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[5]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[6]).length).toBe(1);
    });

    test('Rendering without discounts or payments', () => {
        getTermMock
            .mockReturnValueOnce(getTermResponse[0])
            .mockReturnValueOnce(getTermResponse[1])
            .mockReturnValueOnce(getTermResponse[2])
            .mockReturnValueOnce(getTermResponse[3])
            .mockReturnValueOnce(getTermResponse[4])
            .mockReturnValueOnce(getTermResponse[5])
            .mockReturnValueOnce(getTermResponse[6]);
        useGetDiscountsMock.mockReturnValueOnce([]);
        useGetPaymentsMock.mockReturnValueOnce([]);

        const { container } = render(<TaxesAmount {...props}/>);
        expect(container.getElementsByClassName('taxes-amount').length).toBe(1);
        expect(screen.queryByText(getTermResponse[0])).toEqual(null);
        expect(screen.queryByText(getTermResponse[1])).toEqual(null);
        expect(screen.queryByText(getTermResponse[2])).toEqual(null);
        expect(screen.getAllByText(getTermResponse[3]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[4]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[5]).length).toBe(1);
        expect(screen.getAllByText(getTermResponse[6]).length).toBe(1);
    });

});
