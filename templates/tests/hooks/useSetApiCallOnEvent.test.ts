import {useSetApiCallOnEvent} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {actionSetCallApiOnEvent} from 'src/action';

const dispatchMock = jest.fn();
jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);

describe('Testing hook useSetApiCallOnEvent', () => {

    test('render hook properly', () => {
        useDispatchMock.mockReturnValue(dispatchMock);

        renderHook(() => useSetApiCallOnEvent(true));
        expect(dispatchMock).toBeCalledWith(actionSetCallApiOnEvent(true));
        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });


});
