import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetFees} from 'src/hooks';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetFees', () => {

    test('rendering the hook properly', () => {

        useAppSelectorMock.mockReturnValueOnce(stateMock.data.application_state.fees);
        const {result} = renderHook(() => useGetFees());
        expect(result.current).toBe(stateMock.data.application_state.fees);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
