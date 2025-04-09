import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebouncedShippingLines, useGetValidVariable} from 'src/hooks';
import {postShippingLines, validateShippingLine} from 'src/library';
import {debounceConstants} from 'src/constants';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/library/postShippingLines');
jest.mock('src/library/validateShippingLine');

const useGetValidVariableMock = mocked(useGetValidVariable, true);
const postShippingLinesMock = mocked(postShippingLines, true);
const validateShippingLineMock = mocked(validateShippingLine, true);
const mockDispatch = jest.fn(async (p) => {
    return await p();
});

jest.setTimeout(10000);

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
        useGetValidVariableMock.mockReturnValueOnce(true);
        validateShippingLineMock.mockImplementation(() => Promise.resolve());
        postShippingLinesMock.mockImplementation(()  => Promise.resolve());

        const {result} = renderHook(() => useDebouncedShippingLines());

        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();
        await act(result.current);

        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });
});
