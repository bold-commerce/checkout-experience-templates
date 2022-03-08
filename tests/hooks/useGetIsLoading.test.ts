import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetIsLoading} from 'src/hooks';
import {counterNames} from 'src/constants';
import {mocked} from 'ts-jest/utils';
import {stateMock} from 'src/mocks';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetIsLoading', () => {
    const {one, two} = counterNames;

    test('return false when nothing loading', () => {

        useAppSelectorMock.mockReturnValueOnce(stateMock.isLoading);
        const {result} = renderHook(() => useGetIsLoading());
        expect(result.current).toBe(false);
        expect(useAppSelector).toHaveBeenCalledTimes(one);
    });

    test('return true when something loading', () => {

        const isLoadingMock = stateMock.isLoading;
        isLoadingMock.customerPageButton = true;

        useAppSelectorMock.mockReturnValueOnce(isLoadingMock);
        const {result} = renderHook(() => useGetIsLoading());
        expect(result.current).toBe(true);
        expect(useAppSelector).toHaveBeenCalledTimes(two);
    });
});
