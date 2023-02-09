import {useAppSelector, useGetCountryInfoByCountryCode, useGetCountryInfoList} from 'src/hooks';
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
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('test useGetCountryInfoList hook properly', () => {
        const {result} = renderHook(() => useGetCountryInfoList());
        expect(result.current).toStrictEqual(store.data.initial_data.country_info);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('test useGetCountryInfoByCountryCode hook properly', () => {
        const countryCode = 'CA';

        const {result} = renderHook(() => useGetCountryInfoByCountryCode(countryCode));
        expect(result.current).toStrictEqual(store.data.initial_data.country_info[1]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
