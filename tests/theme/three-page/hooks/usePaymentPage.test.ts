import {renderHook} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {mocked} from 'jest-mock';
import {Constants} from 'src/constants';
import {
    useGetButtonDisableVariable,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLifeFieldsOnPage,
    useGetRequiresShipping,
} from 'src/hooks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {callEpsProcessOrder, getCheckoutUrl, getTerm, getTotalsFromState} from 'src/utils';
import {ITotals} from 'src/types';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/utils/getTerm');
jest.mock('src/library');
jest.mock('src/hooks/useGetIsOrderProcessed');
jest.mock('src/utils/callEpsProcessOrder');
jest.mock('src/utils/getTotalsFromState');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
jest.mock('src/hooks/useGetRequiresShipping');

const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const getTermMock = mocked(getTerm, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const useGetIsOrderProcessedMock = mocked(useGetIsOrderProcessed, true);
const callProcessOrderMock = mocked(callEpsProcessOrder, true);
const getTotalsFromStateMock = mocked(getTotalsFromState, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);

describe('Testing hook usePaymentPage', () => {
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()};
    const shopAliasMock = 'test-shop.alias.com';
    const backLinkTextMock = 'Back Link';
    const backLinkTextExpectation = 'Back Link';
    const nextButtonTextMock = 'Next Button';
    const titleMock = 'Title';
    const nextButtonLoadingMock = false;
    const nextDisableVariableMock = false;
    const eventMock = {preventDefault: jest.fn()};
    const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

    beforeEach(() => {
        jest.resetAllMocks();
        window.shopAlias = shopAliasMock;
        window.platformType = 'shopify';
        useDispatchMock.mockReturnValue(dispatchMock);
        useHistoryMock.mockReturnValue(historyMock);
        useGetIsLoadingMock.mockReturnValue(nextButtonLoadingMock);
        useGetButtonDisableVariableMock.mockReturnValueOnce(nextDisableVariableMock);
        getTotalsFromStateMock.mockReturnValue(total);
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
        useGetRequiresShippingMock.mockReturnValue(true);

    });

    test('Render with empty errors array', async () => {
        getTermMock
            .mockReturnValueOnce(nextButtonTextMock)
            .mockReturnValueOnce(titleMock)
            .mockReturnValueOnce(backLinkTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(3);
        expect(getTermMock).toHaveBeenCalledWith('return_to_shipping', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('complete_order', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('payment_method_title', Constants.GLOBAL_INFO, undefined, 'Checkout form, payment method');
        expect(useGetIsLoadingMock).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        expect(result.current.nextButtonLoading).toBe(nextButtonLoadingMock);
        expect(result.current.nextButtonDisable).toBe(nextDisableVariableMock);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('shipping_lines'));

        await result.current.nextButtonOnClick();
        expect(callProcessOrderMock).toBeCalled();
    });

    test('rendering the hook with complete order', () => {
        useGetIsOrderProcessedMock.mockReturnValue(true);
        renderHook(() => usePaymentPage());
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('thank_you'));
    });

    test('rendering the hook with not requires shipping', () => {
        useGetRequiresShippingMock.mockReturnValue(false);
        const {result} = renderHook(() => usePaymentPage());
        expect(getTermMock).toHaveBeenCalledWith('footer_shipping_cust_info', 'shipping_method');

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(''));
    });

    test('Render with eps gateway', async () => {
        getTermMock
            .mockReturnValueOnce(nextButtonTextMock)
            .mockReturnValueOnce(titleMock)
            .mockReturnValueOnce(backLinkTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledTimes(1);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('shipping_lines'));

        await result.current.nextButtonOnClick();
        expect(callProcessOrderMock).toBeCalled();
    });
});
