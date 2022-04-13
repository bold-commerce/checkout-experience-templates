import {errorFields, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {useGetErrors} from 'src/hooks';
import {useRemoveAllFlashErrors} from 'src/hooks';
import {mocked} from 'jest-mock';
import {IError} from 'src/types';
import * as AppActions from 'src/action/appActionType';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/hooks/useGetErrors');

const useGetErrorsMock = mocked(useGetErrors, true);

describe('Testing hook useRemoveAllFlashErrors', () => {
    const flashError: Array<IError> = [{
        message: 'Test message',
        field: errorFields.discounts,
        severity: errorSeverities.critical,
        sub_type: errorSubTypes.public_order_id,
        type: errorTypes.order,
        address_type: ''
    }];

    const error: Array<IError> = [{
        message: 'Test message',
        field: errorFields.address_line_1,
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.empty,
        type: errorTypes.address,
        address_type: ''
    }];

    const expectedAction = {
        type: AppActions.REMOVE_ERROR,
        payload: flashError[0]
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering the hook without any errors', () => {
        useGetErrorsMock.mockReturnValueOnce([]);
        renderHook(() => useRemoveAllFlashErrors(mockDispatch));
        expect(useGetErrors).toHaveBeenCalledTimes(1);

    });

    test('rendering the hook with errors as second parameter and flash error', () => {
        useGetErrorsMock.mockReturnValueOnce(flashError);
        renderHook(() => useRemoveAllFlashErrors(mockDispatch, flashError));
        expect(useGetErrors).toHaveBeenCalledTimes(0);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });


    test('rendering the hook with errors as second parameter but no flash error', () => {
        useGetErrorsMock.mockReturnValueOnce(error);
        renderHook(() => useRemoveAllFlashErrors(mockDispatch, error));
        expect(useGetErrors).toHaveBeenCalledTimes(0);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
    });

});
