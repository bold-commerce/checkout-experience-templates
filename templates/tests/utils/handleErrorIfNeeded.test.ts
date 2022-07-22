import {
    displayFatalErrorFromTranslation,
    getHook,
    getNeuroIdPageName,
    handleErrorIfNeeded,
    logError,
    isOnlyFlashError,
    neuroIdSubmit,
    retrieveErrorFromResponse,
    setApplicationStateMetaDataFromResponse
} from 'src/utils';
import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {
    apiErrors,
    httpStatusCode,
    IApiErrorResponse,
    IApiResponse,
    IFetchError
} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/utils/displayFatalErrorFromTranslation');
jest.mock('src/utils/standaloneHooks');
jest.mock('src/utils/neuroIdCalls');
jest.mock('src/utils/retrieveErrorFromResponse');
jest.mock('src/utils/isOnlyFlashError');
jest.mock('src/utils/bugReporter');
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);
const getHooksMock = mocked(getHook, true);
const getNeuroIdPageNameMock = mocked(getNeuroIdPageName, true);
const neuroIdSubmitMock = mocked(neuroIdSubmit, true);
const retrieveErrorFromResponseMock = mocked(retrieveErrorFromResponse, true);
const isOnlyFlashErrorMock = mocked(isOnlyFlashError, true);
const logErrorMock = mocked(logError, true);
const setApplicationStateMetaDataFromResponseMock = mocked(setApplicationStateMetaDataFromResponse, true);

describe('Test function handleErrorIfNeeded', () => {
    const dispatchMock = jest.fn();
    const stateMock = jest.fn();
    const historyMock = {replace: jest.fn()} as HistoryLocationState;
    const errorsFromResponseMock: Array<IApiErrorResponse> = [{
        message: 'some message',
        field: 'some field',
        type: 'some type',
        severity: 'some severity',
        sub_type: 'some sub type'
    }];

    const flashErrorFromResponseMock: Array<IApiErrorResponse> = [{
        message: 'some message',
        field: 'customer',
        type: 'order',
        severity: 'validation',
        sub_type: 'customer'
    }];

    const fetchError: IFetchError = {
        body: undefined,
        message: '',
        name: '',
        status: apiErrors.noPigiIframe.status,
        statusText: undefined,
        metaData: undefined
    };

    const response = {
        status: 200,
        success: true,
        error: fetchError,
        response: {},
    };

    const dataSet = [
        {status: apiErrors.noCsrf.status, resResponse: {}, setApplicationStateMetaDataCalls: 1, errorsFromResponse:  undefined, displayErrorCalls: 1, dispatchCalls: 0, logErrorCalls: 0, historyCall: 0},
        {status: 0, resResponse: [], setApplicationStateMetaDataCalls: 1, displayErrorCalls: 0, dispatchCalls: 0, logErrorCalls: 1, historyCall: 0},
    ];

    const errorDataSet = [
        {status: httpStatusCode.UNPROCESSABLE_ENTITY, resResponse: {errors: [{addressType: 'test'}], test: {}}, setApplicationStateMetaDataCalls: 1, errorsFromResponse: errorsFromResponseMock, displayErrorCalls: 0, dispatchCalls: 1, logErrorCalls: 0, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 0},
        {status: httpStatusCode.UNPROCESSABLE_ENTITY, resResponse: undefined, setApplicationStateMetaDataCalls: 1, errorsFromResponse: {}, displayErrorCalls: 0, dispatchCalls: 0, logErrorCalls: 0, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 0},
        {status: httpStatusCode.UNAUTHORIZED, resResponse: undefined, setApplicationStateMetaDataCalls: 1, errorsFromResponse: {}, displayErrorCalls: 0, dispatchCalls: 0, logErrorCalls: 0, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 0},
        {status: apiErrors.general.status, resResponse: {}, setApplicationStateMetaDataCalls: 1, errorsFromResponse: flashErrorFromResponseMock, displayErrorCalls: 0, dispatchCalls: 1, logErrorCalls: 0, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 1},
    ];

    const sessionDataSet = [
        {resResponse: {errors: [{message: 'Expired JWT'}]}, status: httpStatusCode.UNAUTHORIZED, error: 'Session Expired', neuroIdSubmitCalls: 1, retrieveErrorFromResponseCall: 1 },
        {resResponse: {errors: [{message: 'Missing JWT'}]}, status: httpStatusCode.UNAUTHORIZED , error: 'Session Issues', neuroIdSubmitCalls: 0, retrieveErrorFromResponseCall: 1 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getHooksMock.mockReturnValueOnce(historyMock);
        isOnlyFlashErrorMock.mockReturnValue(true);
    });

    test.each(dataSet)(
        'handle error $status, with Errors else than 401 and 422',
        ({status, resResponse, setApplicationStateMetaDataCalls, displayErrorCalls, dispatchCalls, logErrorCalls, historyCall}) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;

            handleErrorIfNeeded(response, dispatchMock, stateMock);

            expect(setApplicationStateMetaDataFromResponseMock).toHaveBeenCalledTimes(setApplicationStateMetaDataCalls);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(displayErrorCalls);
            expect(dispatchMock).toHaveBeenCalledTimes(dispatchCalls);
            expect(logErrorMock).toHaveBeenCalledTimes(logErrorCalls);
            expect(historyMock.replace).toHaveBeenCalledTimes(historyCall);
        });

    test.each(errorDataSet)(
        'handle error status, with Errors 401 and 422 - or Error displaying Flash Message',
        ({status, resResponse, setApplicationStateMetaDataCalls, errorsFromResponse , displayErrorCalls, dispatchCalls, logErrorCalls, historyCall, retrieveErrorFromResponseCall, isOnlyFlashErrorCall}) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;

            retrieveErrorFromResponseMock.mockReturnValue(errorsFromResponse as Array<IApiErrorResponse>);
            handleErrorIfNeeded(response, dispatchMock, stateMock);

            expect(setApplicationStateMetaDataFromResponseMock).toHaveBeenCalledTimes(setApplicationStateMetaDataCalls);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(displayErrorCalls);
            expect(dispatchMock).toHaveBeenCalledTimes(dispatchCalls);
            expect(logErrorMock).toHaveBeenCalledTimes(logErrorCalls);
            expect(historyMock.replace).toHaveBeenCalledTimes(historyCall);
            expect(retrieveErrorFromResponseMock).toHaveBeenCalledTimes(retrieveErrorFromResponseCall);
            expect(isOnlyFlashErrorMock).toHaveBeenCalledTimes(isOnlyFlashErrorCall);
        });

    test.each(sessionDataSet)(
        'handle error status, with Errors: errors',
        ({resResponse, error, status, neuroIdSubmitCalls, retrieveErrorFromResponseCall}) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;
            getNeuroIdPageNameMock.mockReturnValue('some_page_name');
            retrieveErrorFromResponseMock.mockReturnValue(resResponse.errors as Array<IApiErrorResponse>);

            expect(() => handleErrorIfNeeded(response, dispatchMock, stateMock)).toThrow(error);
            expect(getNeuroIdPageNameMock).toHaveBeenCalledTimes(neuroIdSubmitCalls);
            expect(neuroIdSubmitMock).toHaveBeenCalledTimes(neuroIdSubmitCalls);
            expect(retrieveErrorFromResponseMock).toHaveBeenCalledTimes(retrieveErrorFromResponseCall);
        });
});
