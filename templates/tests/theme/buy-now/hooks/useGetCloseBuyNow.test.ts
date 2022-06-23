import { renderHook } from '@testing-library/react-hooks';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import {act, fireEvent} from '@testing-library/react';
import { getTerm } from 'src/utils';
import { mocked } from 'jest-mock';

jest.mock('src/utils', () => ({
    ... jest.requireActual('src/utils'),
    getTerm: jest.fn()
}));

describe('testing hook useGetCloseBuyNow', () => {
    const getTermMock = mocked(getTerm, true);
    const closeEvent = new CustomEvent('buyNow:close');
    window.shopName = 'websiteName';

    test('render the hook properly', () => {
        const { result } = renderHook(() => useGetCloseBuyNow());
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
        getTermMock.mockReturnValueOnce('Close modal').mockReturnValueOnce('Close this modal and try again.');
        
        act(() => {
            result.current.closeBuyNow();
        });

        expect(dispatchEventSpy).toHaveBeenCalledWith(closeEvent);
        expect(result.current.websiteName).toBe(window.shopName);
    });

    test('pressing escape closes modal', () => {
        renderHook(() => useGetCloseBuyNow());
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');

        fireEvent.keyDown(window, {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            charCode: 27
        });

        expect(dispatchEventSpy).toHaveBeenCalledWith(closeEvent);
    });
});
