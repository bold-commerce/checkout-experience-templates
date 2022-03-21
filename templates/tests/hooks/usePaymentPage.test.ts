import {sendAddPaymentAction, sendRefreshOrderAction} from '@bold-commerce/checkout-frontend-library';
import {renderHook} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {mocked} from 'ts-jest/utils';
import {Constants} from 'src/constants';
import {
    useGetDiscounts,
    useGetErrors,
    useGetIsLoading, useGetLineItems,
    useGetPayments,
    useGetSelectShippingLine,
    useGetTaxes,
    usePaymentPage
} from 'src/hooks';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {getCheckoutUrl, getTerm} from 'src/utils';
import {stateMock} from 'src/mocks';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/hooks/useGetErrors');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetDiscounts');
jest.mock('src/hooks/useGetPayments');
jest.mock('src/hooks/useGetTaxes');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/utils/getTerm');
jest.mock('src/library');
const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const useGetErrorsMock = mocked(useGetErrors, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetDiscountsMock = mocked(useGetDiscounts, true);
const useGetPaymentsMock = mocked(useGetPayments, true);
const useGetTaxesMock = mocked(useGetTaxes, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const processOrderMock = mocked(processOrder, true);
const getTermMock = mocked(getTerm, true);
const sendAddPaymentActionMock = mocked(sendAddPaymentAction, true);
const sendRefreshOrderActionMock = mocked(sendRefreshOrderAction, true);

describe('Testing hook usePaymentPage', () => {
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()};
    const processOrderThunkMock = jest.fn();
    const shopAliasMock = 'test-shop.alias.com';
    const backLinkTextMock = 'Back Link';
    const backLinkTextExpectation = '< Back Link';
    const nextButtonTextMock = 'Next Button';
    const nextButtonLoadingMock = false;
    const errorMock = {
        address_type: 'billing',
        sub_type: 'test_sub_type',
        type: 'test_type',
        severity: 'test_severity',
        field: 'test_field',
        message: 'Test error message!'
    };
    const appState = stateMock.data.application_state;
    const selectedShippingLine = {
        id: 'shipping_id_1',
        description: 'USPS ground carrier',
        amount: 1999
    };
    const eventMock = {preventDefault: jest.fn()};

    beforeEach(() => {
        jest.resetAllMocks();
        window.shopAlias = shopAliasMock;
        window.platformType = 'shopify';
        useDispatchMock.mockReturnValue(dispatchMock);
        useHistoryMock.mockReturnValue(historyMock);
        useGetErrorsMock.mockReturnValue([]);
        useGetIsLoadingMock.mockReturnValue(nextButtonLoadingMock);
        useGetTaxesMock.mockReturnValue(appState.taxes);
        useGetSelectShippingLineMock.mockReturnValue(selectedShippingLine);
        useGetLineItemsMock.mockReturnValue(appState.line_items);
        useGetDiscountsMock.mockReturnValue(appState.discounts);
        useGetPaymentsMock.mockReturnValue(appState.payments);
        processOrderMock.mockReturnValue(processOrderThunkMock);
    });

    test('Render with empty errors array', () => {
        getTermMock
            .mockReturnValueOnce(backLinkTextMock)
            .mockReturnValueOnce(nextButtonTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(useGetErrorsMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(getTermMock).toHaveBeenCalledWith('return_to_shipping', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('complete_order', Constants.PAYMENT_INFO);
        expect(useGetIsLoadingMock).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionMock).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        expect(result.current.nextButtonLoading).toBe(nextButtonLoadingMock);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('/shipping_lines'));

        result.current.nextButtonOnClick();
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionMock).toHaveBeenCalledTimes(1);
        expect(sendAddPaymentActionMock).toHaveBeenCalledTimes(1);
    });

    test('Render with empty errors array and full payment', () => {
        const payments = [
            {
                gateway_public_id: 'payment_gateway_public_id_1',
                amount: 220.99,
                tag: 'Credit',
                currency: 'CAD',
                type: 'credit_card',
                display_string: 'PAYMENT OPERATED BY xxx',
                id: 'payment_id',
                token: 'payment_token',
                retain: false,
                value: 22099,
                brand: 'Visa'
            }
        ];
        useGetPaymentsMock.mockReturnValueOnce(payments);
        getTermMock
            .mockReturnValueOnce(backLinkTextMock)
            .mockReturnValueOnce(nextButtonTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(useGetErrorsMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(getTermMock).toHaveBeenCalledWith('return_to_shipping', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('complete_order', Constants.PAYMENT_INFO);
        expect(useGetIsLoadingMock).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionMock).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        expect(result.current.nextButtonLoading).toBe(nextButtonLoadingMock);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('/shipping_lines'));

        result.current.nextButtonOnClick();
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledWith(historyMock);
        expect(sendRefreshOrderActionMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionMock).toHaveBeenCalledTimes(0);
    });

    test('Render with errors in array', () => {
        useGetErrorsMock.mockReturnValueOnce([errorMock]);
        getTermMock
            .mockReturnValueOnce(backLinkTextMock)
            .mockReturnValueOnce(nextButtonTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(useGetErrorsMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(getTermMock).toHaveBeenCalledWith('return_to_shipping', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('complete_order', Constants.PAYMENT_INFO);
        expect(useGetIsLoadingMock).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionMock).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        expect(result.current.nextButtonLoading).toBe(nextButtonLoadingMock);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('/shipping_lines'));

        result.current.nextButtonOnClick();
        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(dispatchMock).not.toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionMock).toHaveBeenCalledTimes(0);
    });
});
