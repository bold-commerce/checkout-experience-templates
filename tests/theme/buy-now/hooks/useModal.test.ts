import {renderHook} from '@testing-library/react-hooks';
import {stateMock} from 'src/mocks';
import {useModal} from 'src/themes/buy-now/hooks/useModal';
import {fireEvent} from '@testing-library/react';
import {checkInventory, initializeSession, setDefaultAddresses} from 'src/library';
import {mocked} from 'jest-mock';
import {actionClearValidStates, actionGetInitialData, actionSetSessionInitialized, actionSetOverlayContent, actionShowHideOverlayContent, actionUpdateAppData} from 'src/action';
import {getOrderInitialization} from 'src/utils/getOrderInitialization';
import {useGetValidVariable} from 'src/hooks';
import {useGetInitializeInModal} from 'src/themes/buy-now/hooks';

function flushMessageQueue(ms = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockDispatch = jest.fn(() => Promise.resolve());
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getOrderInitialization');
jest.mock('src/library/session');
jest.mock('src/library/setDefaultAddresses');
jest.mock('src/library/checkInventory');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/themes/buy-now/hooks/useGetInitializeInModal');
const getOrderInitializationMock = mocked(getOrderInitialization, true);
const initializeSessionMock = mocked(initializeSession, true);
const setDefaultAddressesMock = mocked(setDefaultAddresses, true);
const checkInventoryMock = mocked(checkInventory, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetInitializeInModalMock = mocked(useGetInitializeInModal, true);

describe('Testing useModal', () => {
    const mockSetDefaultAddresses = Promise.resolve();
    const mockInventoryCheck = jest.fn();
    const mockInitializeInModal = {
        initializeInModal: false,
        orderData: null
    };
    Object.defineProperty(window, 'location', {
        value: {
            hostname: 'store.com'
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();
        getOrderInitializationMock.mockReturnValue(stateMock);
        setDefaultAddressesMock.mockReturnValue(mockSetDefaultAddresses);
        checkInventoryMock.mockReturnValue(mockInventoryCheck);
        useGetValidVariableMock.mockReturnValue(false);
        useGetInitializeInModalMock.mockReturnValue(mockInitializeInModal);
    });

    test('test hook properly', () => {
        const {result} = renderHook(() => useModal());
        expect(result.current).toStrictEqual({isOpen: false});
    });

    test('test valid pigi hides overlay content', () => {
        const renderHookResult = renderHook(() => useModal());
        expect(mockDispatch).not.toHaveBeenCalledWith(actionShowHideOverlayContent(false));

        useGetValidVariableMock.mockReturnValue(true);

        renderHookResult.rerender();
        expect(mockDispatch).toHaveBeenCalledWith(actionShowHideOverlayContent(false));
    });

    test('test handle open & close events', async() => {
        const {result} = renderHook(() => useModal());
        const postMessageSpy = jest.spyOn(window.parent, 'postMessage');

        const openEvent = {type: 'buyNow:open'};

        fireEvent(window, new MessageEvent('message', {data: openEvent}));
        await flushMessageQueue();

        expect(result.current.isOpen).toBe(true);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(actionSetOverlayContent(expect.anything()));

        fireEvent(document, new CustomEvent('buyNow:close'));
        await flushMessageQueue();

        expect(result.current.isOpen).toBe(false);
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearValidStates());
        expect(mockDispatch).toHaveBeenCalledWith(actionSetSessionInitialized(false));
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith({type: 'buyNow:close'}, '*');
    });

    test('test handle initialized event', async() => {
        renderHook(() => useModal());
        const loadingOverlay = {
            shown: true,
            inverted: true,
            header: '',
            content: '',
            buttonText: '',
            showCustomContent: true
        };

        const initializedEvent = {type: 'buyNow:initialized'};

        fireEvent(window, new MessageEvent('message', {data: initializedEvent}));
        await flushMessageQueue();

        expect(mockDispatch).toHaveBeenCalledTimes(5);
        expect(mockDispatch).toHaveBeenCalledWith(actionUpdateAppData({...stateMock, overlay: loadingOverlay}));
        expect(mockDispatch).toHaveBeenCalledWith(initializeSessionMock);
        expect(mockDispatch).toHaveBeenCalledWith(actionGetInitialData('store.com'));
        expect(mockDispatch).toHaveBeenCalledWith(setDefaultAddressesMock);
        expect(mockDispatch).toHaveBeenCalledWith(mockInventoryCheck);
    });

    test('test handle initialize in modal', () => {
        useGetInitializeInModalMock.mockReturnValue({
            initializeInModal: true,
            orderData: stateMock.data
        });
        renderHook(() => useModal());
        const loadingOverlay = {
            shown: true,
            inverted: true,
            header: '',
            content: '',
            buttonText: '',
            showCustomContent: true
        };

        expect(mockDispatch).toBeCalledTimes(6);
        expect(mockDispatch).toBeCalledWith(actionUpdateAppData({...stateMock, overlay: loadingOverlay}));
        expect(mockDispatch).toBeCalledWith(initializeSessionMock);
        expect(mockDispatch).toBeCalledWith(actionGetInitialData('store.com'));
        expect(mockDispatch).toBeCalledWith(setDefaultAddressesMock);
        expect(mockDispatch).toBeCalledWith(mockInventoryCheck);
        expect(mockDispatch).toBeCalledWith(actionSetOverlayContent(loadingOverlay));
    });
});
