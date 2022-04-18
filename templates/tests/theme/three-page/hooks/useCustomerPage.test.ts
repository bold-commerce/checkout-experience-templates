import {renderHook} from '@testing-library/react-hooks';
import {useGetButtonDisableVariable, useGetIsLoading, useGetIsOrderProcessed} from 'src/hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {getCheckoutUrl, getTerm} from 'src/utils';
import {callCustomerPageApi} from 'src/library';
import {useCustomerPage} from 'src/themes/three-page/hooks';
import {useHistory} from 'react-router';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/hooks/useGetIsOrderProcessed');
jest.mock('src/library/callCustomerPageApi');
const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const callCustomerPageApiMock = mocked(callCustomerPageApi, true);
const useGetIsOrderProcessedMock = mocked(useGetIsOrderProcessed, true);

describe('Testing hook useCustomerPage', () => {
    const mockDispatch = jest.fn();
    const mockCallCustomerPageApi = jest.fn();
    const getTermValue = 'test-value';
    const eventMock = {preventDefault: jest.fn()};
    const historyMock = {replace: jest.fn()};

    beforeEach(() => {
        jest.resetAllMocks();
        useHistoryMock.mockReturnValue(historyMock);
        useDispatchMock.mockReturnValue(mockDispatch);
        getTermMock.mockReturnValue(getTermValue);
        useGetIsLoadingMock.mockReturnValue(false);
        useGetButtonDisableVariableMock.mockReturnValue(false);
        callCustomerPageApiMock.mockReturnValue(mockCallCustomerPageApi);
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = 'http://test.com';
    });

    test('rendering the hook properly', () => {
        useGetIsOrderProcessedMock.mockReturnValueOnce(false);
        const {result} = renderHook(() => useCustomerPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe('< ' + getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.active).toBe(1);
        expect(hookResult.nextButtonLoading).toBe(false);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);

        expect(window.location.href).toEqual(window.returnUrl);
        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(mockCallCustomerPageApi);
    });

    test('rendering the hook with complete order', () => {
        useGetIsOrderProcessedMock.mockReturnValue(true);
        renderHook(() => useCustomerPage());
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('/thank_you'));
    });

});
