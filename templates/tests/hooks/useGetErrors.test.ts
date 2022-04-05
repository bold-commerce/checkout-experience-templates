import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetErrors} from 'src/hooks';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetErrors', () => {

    test('rendering the hook properly', () => {

        useAppSelectorMock.mockReturnValueOnce(stateMock.errors);
        const {result} = renderHook(() => useGetErrors());
        expect(result.current).toBe(stateMock.errors);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
