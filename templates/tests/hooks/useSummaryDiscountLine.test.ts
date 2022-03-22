import * as appAction from 'src/action/appAction';
import * as deleteDiscounts from 'src/library/deleteDiscounts';
import {renderHook} from '@testing-library/react-hooks';
import {useGetIsLoading, useGetLoaderScreenVariable, useSummaryDiscountLine} from 'src/hooks';
import {act} from '@testing-library/react';
import {actionSetLoaderAndDisableButton} from 'src/action/appAction';
import {mocked} from 'ts-jest/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetIsLoading');
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

describe('Testing hook useSummaryDiscountLine', () => {
    let actionSetLoaderAndDisableButtonSpy: jest.SpyInstance;
    let deleteDiscountsSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        useGetIsLoadingMock.mockReturnValue(false);
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        actionSetLoaderAndDisableButtonSpy = jest.spyOn(appAction, 'actionSetLoaderAndDisableButton');
        deleteDiscountsSpy = jest.spyOn(deleteDiscounts, 'deleteDiscounts');
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

        expect(actionSetLoaderAndDisableButtonSpy).toHaveBeenCalled();
        expect(actionSetLoaderAndDisableButtonSpy).toHaveBeenCalledWith('discountClose', true);
        expect(deleteDiscountsSpy).toHaveBeenCalled();
        expect(deleteDiscountsSpy).toHaveBeenCalledWith( 'TEST_ID');
    });

});
