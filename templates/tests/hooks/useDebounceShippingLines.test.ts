import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebouncedShippingLines} from 'src/hooks';
import {postShippingLines, validateShippingLine} from 'src/library';
import {debounceConstants} from 'src/constants';

jest.setTimeout(10000);
const mockDispatch = jest.fn(() => Promise.resolve());
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useDebouncedShippingLines', () => {

    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    test('rendering the hook properly with timeout', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const {result} = renderHook(() => useDebouncedShippingLines());

        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();

        await mockDispatch;
        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockDispatch).toBeCalledWith(validateShippingLine);
        expect(mockDispatch).toBeCalledWith(postShippingLines);
        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });

});
