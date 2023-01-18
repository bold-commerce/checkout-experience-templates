import {renderHook} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {mocked} from 'jest-mock';
import {Constants} from 'src/constants';
import {useSetPigiListener} from 'src/hooks';
import {
    handlePigiAddPayment,
    handlePigiDisplayFullPage,
    handlePigiDisplayFullPageDone,
    handlePigiHeight,
    handlePigiInitialized,
    handlePigiPaymentAdded,
    handlePigiRefreshOrder,
    handlePigiSca,
    removePigiListenerInLibrary,
    setPigiListenerInLibrary
} from 'src/library';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/library');
const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const handlePigiAddPaymentMock = mocked(handlePigiAddPayment, true);
const handlePigiHeightMock = mocked(handlePigiHeight, true);
const handlePigiInitializedMock = mocked(handlePigiInitialized, true);
const handlePigiPaymentAddedMock = mocked(handlePigiPaymentAdded, true);
const handlePigiRefreshOrderMock = mocked(handlePigiRefreshOrder, true);
const handlePigiDisplayFullPageMock = mocked(handlePigiDisplayFullPage, true);
const handlePigiDisplayFullPageDoneMock = mocked(handlePigiDisplayFullPageDone, true);
const handlePigiScaMock = mocked(handlePigiSca, true);
const setPigiListenerInLibraryMock = mocked(setPigiListenerInLibrary, true);
const removePigiListenerInLibraryMock = mocked(removePigiListenerInLibrary, true);

describe('Testing hook useSetPigiListener', () => {
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()};
    const height = 100;
    const payload = {height};

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
        useHistoryMock.mockReturnValue(historyMock);
    });

    test('rendered and rerender hook', async () => {
        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);

        renderHookResult.unmount();
        expect(removePigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
    });

    test('Trigger PIGI_INITIALIZED event', async () => {
        const eventInit = {data: {responseType: 'PIGI_INITIALIZED', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiInitializedMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(4);
    });

    test('Trigger PIGI_ADD_PAYMENT event', async () => {
        const eventInit = {data: {responseType: 'PIGI_ADD_PAYMENT', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiAddPaymentMock).toHaveBeenCalledTimes(1);
        expect(handlePigiAddPaymentMock).toHaveBeenCalledWith(payload, historyMock);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });

    test('Trigger PIGI_PAYMENT_ADDED event', async () => {
        const eventInit = {data: {responseType: 'PIGI_PAYMENT_ADDED', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiPaymentAddedMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });

    test('Trigger PIGI_HANDLE_SCA event', async () => {
        const eventInit = {data: {responseType: 'PIGI_HANDLE_SCA', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiScaMock).toHaveBeenCalledTimes(1);
        expect(handlePigiScaMock).toHaveBeenCalledWith(payload, historyMock);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });

    test('Trigger PIGI_REFRESH_ORDER event', async () => {
        const eventInit = {data: {responseType: 'PIGI_REFRESH_ORDER', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiRefreshOrderMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });

    test('Trigger PIGI_DISPLAY_IN_FULL_PAGE event', async () => {
        const eventInit = {data: {responseType: 'PIGI_DISPLAY_IN_FULL_PAGE', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiDisplayFullPageMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });

    test('Trigger PIGI_DISPLAY_IN_FULL_PAGE_DONE event', async () => {
        const eventInit = {data: {responseType: 'PIGI_DISPLAY_IN_FULL_PAGE_DONE', payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(1);
        expect(handlePigiHeightMock).toHaveBeenCalledWith(payload);
        expect(handlePigiDisplayFullPageDoneMock).toHaveBeenCalledTimes(1);
        expect(handlePigiDisplayFullPageDoneMock).toHaveBeenCalledWith(payload);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });

    test('Trigger event with no responseType', async () => {
        const eventInit = {data: {responseType: undefined, payload}};
        const event = new MessageEvent('', eventInit);
        let handleEvent;

        setPigiListenerInLibraryMock.mockImplementationOnce((frameId: string, callbackEvent: (evt: Event) => void) => {
            handleEvent = callbackEvent;
            callbackEvent(event);
            return jest.fn();
        });

        const renderHookResult = renderHook(() => useSetPigiListener());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledTimes(1);
        expect(setPigiListenerInLibraryMock).toHaveBeenCalledWith(Constants.PIGI_IFRAME, handleEvent);
        expect(handlePigiHeightMock).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
});
