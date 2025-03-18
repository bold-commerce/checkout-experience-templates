import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {useAppSelector} from 'src/hooks';
import {useGetInitializeInModal} from 'src/themes/buy-now/hooks';
import {initialDataMock} from 'src/mocks';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('testing useGetInitializeInModal', () => {
    test('testing initialize in modal', () => {
        window.initializedOrder = {data: initialDataMock};
        useAppSelectorMock.mockReturnValueOnce(false);
        const {result} = renderHook(() => useGetInitializeInModal());
        
        expect(result.current.initializeInModal).toBe(true);
        expect(result.current.orderData).toBe(initialDataMock);
    });

    test('testing state is initialized', () => {
        useAppSelectorMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => useGetInitializeInModal());

        expect(result.current.initializeInModal).toBe(false);
        expect(result.current.orderData).toBeNull();
    });
  
    test('testing missing public_order_id', () => {
        const data = initialDataMock;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete data.public_order_id;
        window.initializedOrder = {data};
        
        useAppSelectorMock.mockReturnValueOnce(false);
        const {result} = renderHook(() => useGetInitializeInModal());

        expect(result.current.initializeInModal).toBe(false);
        expect(result.current.orderData).toBeNull();
    });
});
