import {
    useAppSelector,
    useGetLifeFields,
    useLifeFieldsByLocations
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

describe('Testing hook useGetLifeFields', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rendering the useGetLifeFields hook properly', () => {
        const {result} = renderHook(() => useGetLifeFields('customer_info'));
        expect(result.current).toStrictEqual([store.data.initial_data.life_elements[0]]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('rendering the useLifeFieldsByLocations hook properly', () => {
        const {result} = renderHook(() => useLifeFieldsByLocations(['customer_info', 'shipping_lines']));
        expect(result.current).toStrictEqual(store.data.initial_data.life_elements);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
