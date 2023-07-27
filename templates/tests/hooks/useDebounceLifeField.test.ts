import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebounceLifeField} from 'src/hooks';
import {patchLifeFields} from 'src/library';
import {debounceConstants} from 'src/constants';
import {mocked} from 'jest-mock';

const mockDispatch = jest.fn();
jest.mock('src/library/patchLifeFields');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
const patchLifeFieldsMock = mocked(patchLifeFields, true);

describe('Testing hook useDebounceLifeField', () => {

    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    test('rendering the hook properly with timeout', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const {result} = renderHook(() => useDebounceLifeField());

        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();

        await mockDispatch;
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(patchLifeFieldsMock);
        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });

});
