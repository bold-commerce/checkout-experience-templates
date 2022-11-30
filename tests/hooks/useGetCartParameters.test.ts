import {
    useAppSelector,
    useGetCartParameters
} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetCartParameters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('test useGetCustomerInfoData hook properly', () => {
        const {result} = renderHook(() => useGetCartParameters());
        expect(result.current).toStrictEqual(store.data.application_state.order_meta_data.cart_parameters);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
