import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetOrderTotal} from 'src/hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetOrderTotal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetOrderTotal());
        expect(result.current).toBe(store.data.application_state.order_total);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
