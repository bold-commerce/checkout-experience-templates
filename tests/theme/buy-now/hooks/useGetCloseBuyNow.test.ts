import { renderHook } from '@testing-library/react-hooks';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { act, fireEvent } from '@testing-library/react';
import { getTerm } from 'src/utils';
import { mocked } from 'jest-mock';

const store = {
    data: {
        public_order_id: '1234567890987654321'
    }
};
jest.mock('src/hooks/rootHooks');
jest.mock('src/utils', () => ({
    ...jest.requireActual('src/utils'),
    getTerm: jest.fn()
}));
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('testing hook useGetCloseBuyNow', () => {
    const getTermMock = mocked(getTerm, true);
    const closeEvent = new CustomEvent('buyNow:close');
    const eventMock = { preventDefault: jest.fn() };
    window.shopName = 'websiteName';


    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'parent', {
            value: {
                location: {
                    href: 'http://dummy.com'
                }
            }
        });
        window.loginUrl = 'http://test.com?id=';
    });

    test('render the hook properly', () => {
        getTermMock.mockReturnValueOnce('Close modal').mockReturnValueOnce('Close this modal and try again.');
        const { result } = renderHook(() => useGetCloseBuyNow());

        result.current && result.current.loginUrl(eventMock);
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
        act(() => {
            result.current.closeBuyNow();
        });

        expect(window.parent.location.href).toEqual(`http://test.com?id=${store.data.public_order_id}`);
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
