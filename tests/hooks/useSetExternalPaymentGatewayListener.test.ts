import {renderHook} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {mocked} from 'jest-mock';
import {useSetExternalPaymentGatewayListener} from 'src/hooks';
import {
    handleExternalPaymentGatewayAddPayment,
    handleExternalPaymentGatewayInitialized,
    handleExternalPaymentGatewayRefreshOrder,
    handleExternalPaymentGatewayUpdateHeight,
    setExternalPaymentGatewayListenerInLibrary,
} from 'src/library';
import {IExternalPaymentGateway} from '@boldcommerce/checkout-frontend-library';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/library');
const useDispatchMock = mocked(useDispatch, true);
const handleExternalPaymentGatewayInitializedMock = mocked(handleExternalPaymentGatewayInitialized, true);
const setExternalPaymentGatewayListenerInLibraryMock = mocked(setExternalPaymentGatewayListenerInLibrary, true);
const handleExternalPaymentGatewayAddPaymentMock = mocked(handleExternalPaymentGatewayAddPayment, true);
const handleExternalPaymentGatewayUpdateHeightMock = mocked(handleExternalPaymentGatewayUpdateHeight, true);
const handleExternalPaymentGatewayRefreshOrderMock = mocked(handleExternalPaymentGatewayRefreshOrder, true);

describe('Testing useSetExternalPaymentGatewayListener hook ', () => {
    const dispatchMock = jest.fn();
    const height = 100;
    const payload = {height};
    const gateway = {
        'is_test': true,
        'iframe_url': 'testURL',
        'target_div': 'payment',
        'base_url': 'testURL',
        'public_id': 'publicID',
        'location': 'payment_method_below',
        'currency': 'USD'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
    });

    test('Trigger EXTERNAL_PAYMENT_GATEWAY_INITIALIZED event', async () => {
        const eventInit = {data: {type: 'EXTERNAL_PAYMENT_GATEWAY_INITIALIZED', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setExternalPaymentGatewayListenerInLibraryMock.mockImplementationOnce((gateway: IExternalPaymentGateway, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetExternalPaymentGatewayListener(gateway));

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledWith(gateway, handleEvent);
        expect(handleExternalPaymentGatewayInitializedMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

    test('Trigger default event', async () => {
        const eventInit = {data: {type: 'bad', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setExternalPaymentGatewayListenerInLibraryMock.mockImplementationOnce((gateway: IExternalPaymentGateway, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetExternalPaymentGatewayListener(gateway));

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledWith(gateway, handleEvent);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    test('Trigger EXTERNAL_PAYMENT_GATEWAY_ADD_PAYMENT event', async () => {
        const eventInit = {data: {type: 'EXTERNAL_PAYMENT_GATEWAY_ADD_PAYMENT', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setExternalPaymentGatewayListenerInLibraryMock.mockImplementationOnce((gateway: IExternalPaymentGateway, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetExternalPaymentGatewayListener(gateway));

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledWith(gateway, handleEvent);
        expect(handleExternalPaymentGatewayAddPaymentMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

    test('Trigger EXTERNAL_PAYMENT_GATEWAY_UPDATE_HEIGHT event', async () => {
        const eventInit = {data: {type: 'EXTERNAL_PAYMENT_GATEWAY_UPDATE_HEIGHT', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setExternalPaymentGatewayListenerInLibraryMock.mockImplementationOnce((gateway: IExternalPaymentGateway, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetExternalPaymentGatewayListener(gateway));

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledWith(gateway, handleEvent);
        expect(handleExternalPaymentGatewayUpdateHeightMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

    test('Trigger EXTERNAL_PAYMENT_GATEWAY_REFRESH_ORDER event', async () => {
        const eventInit = {data: {type: 'EXTERNAL_PAYMENT_GATEWAY_REFRESH_ORDER', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setExternalPaymentGatewayListenerInLibraryMock.mockImplementationOnce((gateway: IExternalPaymentGateway, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetExternalPaymentGatewayListener(gateway));

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setExternalPaymentGatewayListenerInLibraryMock).toHaveBeenCalledWith(gateway, handleEvent);
        expect(handleExternalPaymentGatewayRefreshOrderMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
    });
});
