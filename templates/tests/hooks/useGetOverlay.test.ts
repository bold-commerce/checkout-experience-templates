import {useAppSelector, useGetOverlay} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    overlay: 'test'
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetLineItems', () => {
    test('test hook properly', () => {
        const {result} = renderHook(() => useGetOverlay());
        expect(result.current).toStrictEqual('test');
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
