import { renderHook } from '@testing-library/react-hooks';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import {act} from '@testing-library/react';


describe('testing hook useGetCloseBuyNow', () => {
    const closeEvent = new CustomEvent('buyNow:close');

    test('render the hook properly', () => {
        const { result } = renderHook(() => useGetCloseBuyNow());
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
        
        act(() => {
            result.current();
        });

        expect(dispatchEventSpy).toHaveBeenCalledWith(closeEvent);
    });
});
