import {
    useAppSelector,
    useGetValidVariable,
} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    isValid: {test: true}
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetValidVariable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing hook properly', () => {
        const field = 'test';
        const {result} = renderHook(() => useGetValidVariable(field));
        expect(result.current).toStrictEqual(true);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
