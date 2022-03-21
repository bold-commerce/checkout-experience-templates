import {useAppSelector, useGetLineItems} from 'src/hooks';
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
        const {result} = renderHook(() => useGetLineItems());
        expect(result.current).toStrictEqual(store.data.application_state.line_items);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
