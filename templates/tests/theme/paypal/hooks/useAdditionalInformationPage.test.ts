import {renderHook} from '@testing-library/react-hooks';
import {
    useGetButtonDisableVariable,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLifeFieldsOnPage,
} from 'src/hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {getTerm, getReturnToCartTermAndLink} from 'src/utils';
import {useHistory} from 'react-router';
import {actionClearErrors} from 'src/action';
import {useAdditionalInformationPage} from 'src/themes/paypal/hooks';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/hooks/useGetIsOrderProcessed');
jest.mock('src/utils/getReturnToCartTermAndLink');
jest.mock('src/hooks/useGetLifeFieldsOnPage');
jest.mock('src/hooks/useGetLifeFields');

const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const useGetIsOrderProcessedMock = mocked(useGetIsOrderProcessed, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);
const useGetLifeFieldsOnPageMock = mocked(useGetLifeFieldsOnPage, true);

describe('Testing hook useAdditionalInformationPage', () => {
    const mockDispatch = jest.fn();
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
        useGetLifeFieldsOnPageMock.mockReturnValue([]);
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = 'http://test.com';
        getReturnToCartTermAndLinkMock.mockReturnValue({term:'cart', link: 'http://test.com'});
    });

    test('rendering the hook properly', () => {
        useGetIsOrderProcessedMock.mockReturnValueOnce(false);
        const {result} = renderHook(() => useAdditionalInformationPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.nextButtonLoading).toBe(false);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);

        expect(window.location.href).toEqual(window.returnUrl);
        result.current.nextButtonOnClick && result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
    });
});
