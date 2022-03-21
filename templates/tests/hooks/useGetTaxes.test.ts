import {useAppSelector, useGetTaxes} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetLineItems', () => {
    test('test hook properly', () => {
        const {result} = renderHook(() => useGetTaxes());
        expect(result.current).toStrictEqual([{is_included: false, name: 'test tax', value: 10}]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
