import {renderHook} from '@testing-library/react-hooks';
import {useGetButtonDisableVariable, useGetIsLoading, useGetIsOrderProcessed} from 'src/hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {getCheckoutUrl, getTerm, isShippingLineSelectedValid} from 'src/utils';
import {useHistory} from 'react-router';
import {callShippingLinesPageApi} from 'src/library';
import {useShippingPage} from 'src/themes/three-page/hooks';
import {actionClearErrors} from 'src/action';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/utils/isShippingLineSelectedValid');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/library/callShippingLinesPageApi');
jest.mock('src/hooks/useGetIsOrderProcessed');
const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const callShippingLinesPageApiMock = mocked(callShippingLinesPageApi, true);
const useGetIsOrderProcessedMock = mocked(useGetIsOrderProcessed, true);
const isShippingLineSelectedValidMock = mocked(isShippingLineSelectedValid, true);

describe('Testing hook useShippingPage', () => {
    const mockDispatch = jest.fn();
    const mockCallShippingLinesPageApi = jest.fn();
    const getTermValue = 'test-value';
    const historyMock = {replace: jest.fn()};
    const eventMock = {preventDefault: jest.fn()};
    const pageNameWithPrefix = 'prefix_page_name';

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
        isShippingLineSelectedValidMock.mockReturnValue(true);

        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

    test('rendering the hook properly with shipping incorrect AND useGetButtonDisableVariable returns FALSE', () => {
        useGetIsOrderProcessedMock.mockReturnValue(false);
        isShippingLineSelectedValidMock.mockReturnValue(false);

        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

    test('rendering the hook properly with shipping incorrect AND useGetButtonDisableVariable returns TRUE', () => {
        useGetIsOrderProcessedMock.mockReturnValue(false);
        isShippingLineSelectedValidMock.mockReturnValue(false);
        useGetButtonDisableVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(true);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

    test('rendering the hook with complete order', () => {
        useGetIsOrderProcessedMock.mockReturnValue(true);
        isShippingLineSelectedValidMock.mockReturnValue(true);

        renderHook(() => useShippingPage());
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('thank_you'));
    });
});
