import {IApiErrorResponse, IFetchError, IPigiResponseType} from '@bold-commerce/checkout-frontend-library';
import { sendRefreshOrderActionAsync, sendAddPaymentActionAsync } from '@bold-commerce/checkout-frontend-library/lib/pigi';
import {renderHook} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {mocked} from 'jest-mock';
import {Constants} from 'src/constants';
import {
    useGetButtonDisableVariable,
    useGetDiscounts,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLineItems,
    useGetPayments,
    useGetSelectShippingLine,
    useGetTaxes
} from 'src/hooks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {getCheckoutUrl, getNeuroIdPageName, getTerm, neuroIdSubmit} from 'src/utils';
import {stateMock} from 'src/mocks';
import {actionAddError, actionClearErrors, actionShowHideOverlayContent} from 'src/action';
import { pigiActionTypes } from '@bold-commerce/checkout-frontend-library/lib/variables/constants';

jest.mock('@bold-commerce/checkout-frontend-library/lib/pigi');
jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/hooks/useGetDiscounts');
jest.mock('src/hooks/useGetPayments');
jest.mock('src/hooks/useGetTaxes');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/utils/getTerm');
jest.mock('src/library');
jest.mock('src/hooks/useGetIsOrderProcessed');
jest.mock('src/utils/neuroIdCalls');

const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetDiscountsMock = mocked(useGetDiscounts, true);
const useGetPaymentsMock = mocked(useGetPayments, true);
const useGetTaxesMock = mocked(useGetTaxes, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const processOrderMock = mocked(processOrder, true);
const getTermMock = mocked(getTerm, true);
const sendRefreshOrderActionAsyncMock = mocked(sendRefreshOrderActionAsync, true);
const sendAddPaymentActionAsyncMock = mocked(sendAddPaymentActionAsync, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const useGetIsOrderProcessedMock = mocked(useGetIsOrderProcessed, true);
const neuroIdSubmitMock = mocked(neuroIdSubmit, true);
const getNeuroIdPageNameMock = mocked(getNeuroIdPageName, true);

describe('Testing hook usePaymentPage', () => {
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()};
    const processOrderThunkMock = jest.fn();
    const shopAliasMock = 'test-shop.alias.com';
    const backLinkTextMock = 'Back Link';
    const backLinkTextExpectation = '< Back Link';
    const nextButtonTextMock = 'Next Button';
    const nextButtonLoadingMock = false;
    const nextDisableVariableMock = false;
    const appState = stateMock.data.application_state;
    const selectedShippingLine = {
        id: 'shipping_id_1',
        description: 'USPS ground carrier',
        amount: 1999
    };
    const eventMock = {preventDefault: jest.fn()};
    const pageNameWithPrefix = 'prefix_page_name';
    const resolvedRefreshValue: IPigiResponseType = {
        responseType: pigiActionTypes.PIGI_REFRESH_ORDER,
        payload: { key: 'value' }
    }
    const resolvedPaymentValue: IPigiResponseType = {
        responseType: pigiActionTypes.PIGI_ADD_PAYMENT,
        payload: { key: 'value' }
    }
    const rejectedValue: IFetchError = {
        status: 1000,
        statusText: undefined,
        body: undefined,
        metaData: undefined,
        name: 'FetchError',
        message: 'There has been an error fetching'
    }    
    const convertedFetchError: IApiErrorResponse = {
        message: '',
        type: 'api',
        field: '',
        severity: 'critical',
        sub_type: ''
    }

    beforeEach(() => {
        jest.resetAllMocks();
        window.shopAlias = shopAliasMock;
        window.platformType = 'shopify';
        useDispatchMock.mockReturnValue(dispatchMock);
        useHistoryMock.mockReturnValue(historyMock);
        useGetIsLoadingMock.mockReturnValue(nextButtonLoadingMock);
        useGetButtonDisableVariableMock.mockReturnValueOnce(nextDisableVariableMock);
        useGetTaxesMock.mockReturnValue(appState.taxes);
        useGetSelectShippingLineMock.mockReturnValue(selectedShippingLine);
        useGetLineItemsMock.mockReturnValue(appState.line_items);
        useGetDiscountsMock.mockReturnValue(appState.discounts);
        useGetPaymentsMock.mockReturnValue(appState.payments);
        processOrderMock.mockReturnValue(processOrderThunkMock);
        getNeuroIdPageNameMock.mockReturnValue(pageNameWithPrefix);
        sendRefreshOrderActionAsyncMock.mockResolvedValue(resolvedRefreshValue);
        sendAddPaymentActionAsyncMock.mockResolvedValue(resolvedPaymentValue);
    });

    test('Render with empty errors array', async () => {
        getTermMock
            .mockReturnValueOnce(backLinkTextMock)
            .mockReturnValueOnce(nextButtonTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(getTermMock).toHaveBeenCalledWith('return_to_shipping', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('complete_order', Constants.PAYMENT_INFO);
        expect(useGetIsLoadingMock).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        expect(result.current.nextButtonLoading).toBe(nextButtonLoadingMock);
        expect(result.current.nextButtonDisable).toBe(nextDisableVariableMock);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('shipping_lines'));

        await result.current.nextButtonOnClick();
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(1);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(1);
        expect(neuroIdSubmitMock).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
        expect(neuroIdSubmitMock).toHaveBeenCalledWith(pageNameWithPrefix);
    });

    test('Render with empty errors array and full payment', async () => {
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
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(getTermMock).toHaveBeenCalledWith('return_to_shipping', Constants.PAYMENT_INFO);
        expect(getTermMock).toHaveBeenCalledWith('complete_order', Constants.PAYMENT_INFO);
        expect(useGetIsLoadingMock).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        expect(result.current.nextButtonLoading).toBe(nextButtonLoadingMock);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('shipping_lines'));

        await result.current.nextButtonOnClick();
        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).toHaveBeenCalledWith(actionClearErrors());
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledWith(historyMock, pageNameWithPrefix);
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(neuroIdSubmitMock).toHaveBeenCalledTimes(1);
        expect(neuroIdSubmitMock).toHaveBeenCalledWith(pageNameWithPrefix);
    });

    test('rendering the hook with complete order', () => {
        useGetIsOrderProcessedMock.mockReturnValue(true);
        renderHook(() => usePaymentPage());
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('thank_you'));
    });

    test('testing if refreshing order action rejected promise', async () => {
        sendRefreshOrderActionAsyncMock.mockRejectedValue(rejectedValue);
        const {result: {current}} = renderHook(() => usePaymentPage());

        await current.nextButtonOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(dispatchMock).toHaveBeenCalledWith(actionShowHideOverlayContent(false));
        expect(dispatchMock).toHaveBeenCalledWith(actionAddError(convertedFetchError));
        expect(sendRefreshOrderActionAsyncMock).toHaveBeenCalledTimes(1);
        expect(sendAddPaymentActionAsyncMock).toHaveBeenCalledTimes(0);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });
});
