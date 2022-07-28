import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetIsSessionInitialized} from 'src/hooks';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetIsSessionInitialized', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('return false when not session not initialized', () => {
        const isSessionInitializedMock = false;

        useAppSelectorMock.mockReturnValueOnce(isSessionInitializedMock);
        const {result} = renderHook(() => useGetIsSessionInitialized());
        expect(result.current).toBe(false);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('return true when session is initialized', () => {
        const isSessionInitializedMock = true;

        useAppSelectorMock.mockReturnValueOnce(isSessionInitializedMock);
        const {result} = renderHook(() => useGetIsSessionInitialized());
        expect(result.current).toBe(true);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
