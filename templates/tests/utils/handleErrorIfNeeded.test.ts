import {displayFatalErrorFromTranslation, getHook, handleErrorIfNeeded} from 'src/utils';
import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {apiErrors, httpStatusCode} from '@bold-commerce/checkout-frontend-library/lib/variables';
import SpyInstance = jest.SpyInstance;
import {IApiResponse} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/utils/displayFatalErrorFromTranslation');
jest.mock('src/utils/standaloneHooks');
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);
const getHooksMock = mocked(getHook, true);

describe('Test function handleErrorIfNeeded', () => {
    const dispatchMock = jest.fn();
    const stateMock = jest.fn();
    let consoleSpy: SpyInstance;
    const historyMock = {replace: jest.fn()} as HistoryLocationState;

    const response = {
        success: true,
        error: {status: apiErrors.noPigiIframe.status},
        response: {},
    };

    const dataSet = [
        {status: apiErrors.noCsrf.status, resResponse: {}, displayErrorCalls: 1, dispatchCalls: 0, consoleCalls: 0, historyCall: 0},
        {status: apiErrors.general.status, resResponse: {}, displayErrorCalls: 0, dispatchCalls: 0, consoleCalls: 0, historyCall: 0},
        {status: httpStatusCode.UNPROCESSABLE_ENTITY, resResponse: {errors: [{addressType: 'test'}], test: {}}, displayErrorCalls: 0, dispatchCalls: 1, consoleCalls: 0, historyCall: 0},
        {status: httpStatusCode.UNPROCESSABLE_ENTITY, resResponse: undefined, displayErrorCalls: 0, dispatchCalls: 0, consoleCalls: 0, historyCall: 0},
        {status: httpStatusCode.UNAUTHORIZED, resResponse: undefined, displayErrorCalls: 0, dispatchCalls: 0, consoleCalls: 0, historyCall: 0},
        {status: 'unknown', resResponse: [], displayErrorCalls: 0, dispatchCalls: 0, consoleCalls: 1, historyCall: 0},
    ];

    const sessionDataSet = [
        {resResponse: {errors: [{message: 'Expired JWT'}]}, status: httpStatusCode.UNAUTHORIZED, error: 'Session Expired' },
        {resResponse: {errors: [{message: 'Missing JWT'}]}, status: httpStatusCode.UNAUTHORIZED , error: 'Session Issues' },
    ]

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
        getHooksMock.mockReturnValueOnce(historyMock);
    });

    test.each(dataSet)(
        'handle error $status, with Errors: $errors',
        ({status, resResponse, displayErrorCalls, dispatchCalls, consoleCalls, historyCall}) => {
            response.error = {status: status};
            response.response = resResponse as IApiResponse;

            handleErrorIfNeeded(response, dispatchMock, stateMock);

            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(displayErrorCalls);
            expect(dispatchMock).toHaveBeenCalledTimes(dispatchCalls);
            expect(consoleSpy).toHaveBeenCalledTimes(consoleCalls);
            expect(historyMock.replace).toHaveBeenCalledTimes(historyCall);
        });

    test.each(sessionDataSet)(
        'handle error $status, with Errors: $errors',
        ({resResponse, error, status}) => {
            response.error = {status: status};
            response.response = resResponse as IApiResponse;
            expect(() => {handleErrorIfNeeded(response, dispatchMock, stateMock)}).toThrow(error);

        });

});
