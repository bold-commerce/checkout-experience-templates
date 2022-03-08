import {renderHook} from '@testing-library/react-hooks';
import {useGetPayments} from 'src/hooks';
import {stateMock} from 'src/mocks/stateMock';
import {useAppSelector} from 'src/hooks/rootHooks';
import {mocked} from 'ts-jest/utils';
import {counterNames} from 'src/constants';

jest.mock('src/library/paymentIframe');
jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useGetPayments', () => {
    const {one} = counterNames;

    test('rendering the hook properly', () => {
        useAppSelectorMock.mockReturnValueOnce(stateMock.data.application_state.payments);

        const {result} = renderHook(() => useGetPayments());

        expect(result.current).toBe(stateMock.data.application_state.payments);
        expect(useAppSelectorMock).toHaveBeenCalledTimes(one);
    });
});
