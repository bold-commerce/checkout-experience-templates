import {act} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {useGetIsLoading, useGetLoaderScreenVariable, useSummaryDiscountLine} from 'src/hooks';
import {deleteDiscounts} from 'src/library';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/action');
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/library');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const deleteDiscountsMock = mocked(deleteDiscounts, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

describe('Testing hook useSummaryDiscountLine', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        useGetIsLoadingMock.mockReturnValue(false);
        useGetLoaderScreenVariableMock.mockReturnValue(false);
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useSummaryDiscountLine());
        const hookResult = result.current;
        expect(hookResult.discountCloseLoading).toBe(false);
    });

    test('calling the delete Element from state function', () => {
        const {result} = renderHook(() => useSummaryDiscountLine());
        const hookResult = result.current;
        act(() => {
            hookResult.deleteElementFromState('TEST', 'TEST_ID');
        });

        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('discountClose', true);
        expect(deleteDiscountsMock).toHaveBeenCalled();
        expect(deleteDiscountsMock).toHaveBeenCalledWith( 'TEST_ID');
    });
});
