import {renderHook} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {mocked} from 'jest-mock';
import {useWindowDimensions} from 'src/hooks';

jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);

describe('Testing hook useWindowDimensions', () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
    });

    test('rendered and rerender hook', async () => {
        const renderHookResult = renderHook(() => useWindowDimensions());

        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        renderHookResult.rerender();
        expect(useDispatchMock).toHaveBeenCalledTimes(2);

        expect(dispatchMock).toHaveBeenCalledTimes(0);
        global.dispatchEvent(new Event('resize'));
        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

});
