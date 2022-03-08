import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetPigiDisplaySca} from 'src/hooks';

const store = {
    appSetting: {pigiDisplaySca: true}
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetPigiDisplaySca', () => {
    test('test hook properly', () => {
        const {result} = renderHook(() => useGetPigiDisplaySca());
        expect(useAppSelector).toHaveBeenCalledTimes(1);
        expect(result.current).toBe(true);
    });
});
