import {
    useAppSelector,
    useGetCustomerInfoData,
    useGetCustomerInfoDataByField,
    useGetCustomerMarketingField
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

describe('Testing useGetCustomerInformation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('test useGetCustomerInfoData hook properly', () => {
        const {result} = renderHook(() => useGetCustomerInfoData());
        expect(result.current).toStrictEqual(store.data.application_state.customer);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('test useGetCustomerInfoData hook properly', () => {
        const field = 'platform_id';

        const {result} = renderHook(() => useGetCustomerInfoDataByField(field));
        expect(result.current).toStrictEqual(store.data.application_state.customer[field]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('test useGetCustomerInfoData hook properly', () => {
        const {result} = renderHook(() => useGetCustomerMarketingField());
        expect(result.current).toStrictEqual(store.data.application_state.customer.accepts_marketing);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
