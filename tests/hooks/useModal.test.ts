import {renderHook} from '@testing-library/react-hooks';
import { stateMock } from 'src/mocks';
import { useModal } from 'src/themes/buy-now/hooks/useModal';
import {act} from '@testing-library/react';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing useModal', () => {
    test('test hook properly', () => {
        const {result} = renderHook(() => useModal());
        expect(result.current).toStrictEqual({isOpen: false});
    });

    test('test handle events', () => {
        const {result} = renderHook(() => useModal());
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');

        const openEvent = new CustomEvent('buyNow:open', { detail: stateMock.data });
        const closeEvent = new CustomEvent('buyNow:close');

        act(() => {
            document.dispatchEvent(openEvent);
        });

        expect(dispatchEventSpy).toHaveBeenCalledWith(openEvent);
        expect(result.current.isOpen).toBe(true);

        act(() => {
            document.dispatchEvent(closeEvent);
        });

        expect(dispatchEventSpy).toHaveBeenCalledWith(closeEvent);
        expect(result.current.isOpen).toBe(false);
    });
});
