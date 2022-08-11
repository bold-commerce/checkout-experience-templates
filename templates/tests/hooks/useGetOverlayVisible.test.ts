import {useAppSelector, useGetOverlayVisible} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    overlay: {
        shown: true
    }
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetOverlayVisible', () => {
    test('test hook properly', () => {
        const {result} = renderHook(() => useGetOverlayVisible());
        expect(result.current).toBe(true);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
