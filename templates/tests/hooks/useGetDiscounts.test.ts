import {useAppSelector, useGetDiscounts} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetCountryData', () => {
    test('test useGetCountryInfoList hook properly', () => {
        const {result} = renderHook(() => useGetDiscounts());
        expect(result.current).toStrictEqual(store.data.application_state.discounts);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
