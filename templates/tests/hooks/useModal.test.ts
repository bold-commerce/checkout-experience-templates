import {renderHook} from '@testing-library/react-hooks';
import { stateMock } from 'src/mocks';
import { useModal } from 'src/themes/buy-now/hooks/useModal';
import {act} from '@testing-library/react';
import { checkInventory, initializeSession, setDefaultAddresses } from 'src/library';
import { mocked } from 'jest-mock';
import { actionGetInitialData, actionUpdateAppData } from 'src/action';
import { getOrderInitialization } from 'src/utils/getOrderInitialization';

const mockDispatch = jest.fn(() => Promise.resolve());
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getOrderInitialization');
jest.mock('src/library/session');
jest.mock('src/library/setDefaultAddresses');
jest.mock('src/library/checkInventory');
const getOrderInitializationMock = mocked(getOrderInitialization, true);
const initializeSessionMock = mocked(initializeSession, true);
const setDefaultAddressesMock = mocked(setDefaultAddresses, true);
const checkInventoryMock = mocked(checkInventory, true);

describe('Testing useModal', () => {
    const mockSetDefaultAddresses = Promise.resolve();
    const mockInventoryCheck = jest.fn();
    Object.defineProperty(window, 'location', {
        value: {
            hostname: 'store.com'
        }
    });
    
    beforeEach(() => {
        getOrderInitializationMock.mockReturnValue(stateMock);
        setDefaultAddressesMock.mockReturnValue(mockSetDefaultAddresses);
        checkInventoryMock.mockReturnValue(mockInventoryCheck);
    });

    test('test hook properly', () => {
        const {result} = renderHook(() => useModal());
        expect(result.current).toStrictEqual({isOpen: false});
    });

    test('test handle events', async() => {
        const {result} = renderHook(() => useModal());
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');

        const openEvent = new CustomEvent('buyNow:open', { detail: stateMock.data });
        const closeEvent = new CustomEvent('buyNow:close');

        act(() => {
            document.dispatchEvent(openEvent);
        });
        //wait for promise to return on setDefaultAddresses
        await null;

        expect(dispatchEventSpy).toHaveBeenCalledWith(openEvent);

        expect(mockDispatch).toHaveBeenCalledWith(actionUpdateAppData(stateMock));
        expect(mockDispatch).toHaveBeenCalledWith(initializeSessionMock);
        expect(mockDispatch).toHaveBeenCalledWith(actionGetInitialData('store.com'));
        expect(mockDispatch).toHaveBeenCalledWith(setDefaultAddressesMock);
        expect(mockDispatch).toHaveBeenCalledWith(mockInventoryCheck); 

        expect(result.current.isOpen).toBe(true);

        act(() => {
            document.dispatchEvent(closeEvent);
        });

        expect(dispatchEventSpy).toHaveBeenCalledWith(closeEvent);
        expect(result.current.isOpen).toBe(false);
    });
});
