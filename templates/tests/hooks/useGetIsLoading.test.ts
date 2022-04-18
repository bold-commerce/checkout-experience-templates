import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetIsLoading} from 'src/hooks';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetIsLoading', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('return false when nothing loading', () => {

        useAppSelectorMock.mockReturnValueOnce(stateMock.isLoading);
        const {result} = renderHook(() => useGetIsLoading());
        expect(result.current).toBe(false);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('return true when something loading', () => {

        const isLoadingMock = stateMock.isLoading;
        isLoadingMock.customerPageButton = true;

        useAppSelectorMock.mockReturnValueOnce(isLoadingMock);
        const {result} = renderHook(() => useGetIsLoading());
        expect(result.current).toBe(true);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
