import {renderHook} from '@testing-library/react-hooks';
import {useGetButtonDisableVariable, useGetIsLoading, useShippingPage} from 'src/hooks';
import {mocked} from 'ts-jest/utils';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {useHistory} from 'react-router';
import {callShippingLinesPageApi} from 'src/library';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/library/callShippingLinesPageApi');
const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const callShippingLinesPageApiMock = mocked(callShippingLinesPageApi, true);

describe('Testing hook useShippingPage', () => {
    const mockDispatch = jest.fn();
    const mockCallShippingLinesPageApi = jest.fn();
    const getTermValue = 'test-value';
    const historyMock = {replace: jest.fn()};
    const eventMock = {preventDefault: jest.fn()};

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(mockDispatch);
        useHistoryMock.mockReturnValue(historyMock);
        getTermMock.mockReturnValue(getTermValue);
        useGetIsLoadingMock.mockReturnValue(false);
        useGetButtonDisableVariableMock.mockReturnValue(false);
        callShippingLinesPageApiMock.mockReturnValue(mockCallShippingLinesPageApi);
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe('< ' + getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

});
