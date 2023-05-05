import {
    displayFatalErrorFromTranslation,
    getHook,
    handleErrorIfNeeded,
    isOnlyFlashError,
    retrieveErrorFromResponse,
    setApplicationStateMetaDataFromResponse,
    setMetadata,
    displayDefaultFlashError
} from 'src/utils';
import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {
    apiErrors,
    httpStatusCode,
    IApiErrorResponse,
    IApiResponse,
    IFetchError
} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/utils/displayFatalErrorFromTranslation');
jest.mock('src/utils/standaloneHooks');
jest.mock('src/utils/retrieveErrorFromResponse');
jest.mock('src/utils/isOnlyFlashError');
jest.mock('src/utils/bugReporter');
jest.mock('src/utils/displayDefaultFlashError');

const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);
const getHooksMock = mocked(getHook, true);
const retrieveErrorFromResponseMock = mocked(retrieveErrorFromResponse, true);
const isOnlyFlashErrorMock = mocked(isOnlyFlashError, true);
const setMetadataMock = mocked(setMetadata, true);
const setApplicationStateMetaDataFromResponseMock = mocked(setApplicationStateMetaDataFromResponse, true);
const displayDefaultFlashErrorMock = mocked(displayDefaultFlashError, true);

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

    const fatalErrorDataSet = [
        {status: apiErrors.noCsrf.status, resResponse: {}, setApplicationStateMetaDataCalls: 1, errorsFromResponse:  undefined, displayErrorCalls: 1, dispatchCalls: 0, setMetadataCalls: 0, historyCall: 0, error: 'Got 1001 from the API'},
        {status: httpStatusCode.INTERNAL_SERVER_ERROR, resResponse: [], setApplicationStateMetaDataCalls: 1, displayErrorCalls: 1, dispatchCalls: 0, setMetadataCalls: 0, historyCall: 0, error: 'Got 500 from the API'},
        {status: 1, resResponse: [], setApplicationStateMetaDataCalls: 1, displayErrorCalls: 1, dispatchCalls: 0, setMetadataCalls: 1, historyCall: 0, error: ''},

    ];

    const errorDataSet = [
        {status: httpStatusCode.UNPROCESSABLE_ENTITY, resResponse: {errors: [{addressType: 'test'}], test: {}}, setApplicationStateMetaDataCalls: 1, errorsFromResponse: errorsFromResponseMock, displayErrorCalls: 0, dispatchCalls: 1, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 0},
        {status: httpStatusCode.UNPROCESSABLE_ENTITY, resResponse: undefined, setApplicationStateMetaDataCalls: 1, errorsFromResponse: {}, displayErrorCalls: 0, dispatchCalls: 0, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 0},
        {status: httpStatusCode.UNAUTHORIZED, resResponse: undefined, setApplicationStateMetaDataCalls: 1, errorsFromResponse: {}, displayErrorCalls: 0, dispatchCalls: 0, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 0},
        {status: apiErrors.general.status, resResponse: {}, setApplicationStateMetaDataCalls: 1, errorsFromResponse: flashErrorFromResponseMock, displayErrorCalls: 0, dispatchCalls: 1, historyCall: 0, retrieveErrorFromResponseCall: 1, isOnlyFlashErrorCall: 1},
    ];

    const sessionDataSet = [
        {resResponse: {errors: [{message: 'Expired JWT'}]}, status: httpStatusCode.UNAUTHORIZED, error: 'Session Expired', retrieveErrorFromResponseCall: 1 },
        {resResponse: {errors: [{message: 'Missing JWT'}]}, status: httpStatusCode.UNAUTHORIZED , error: 'Session Issues', retrieveErrorFromResponseCall: 1 },
    ];

    const flashErrorSet = [
        {status: httpStatusCode.BAD_REQUEST, resResponse: {}, displayDefaultFlashErrorCalls: 1, errorsFromResponse: flashErrorFromResponseMock},
        {status: httpStatusCode.SERVICE_UNAVAILABLE, resResponse: {}, displayDefaultFlashErrorCalls: 1, errorsFromResponse: flashErrorFromResponseMock},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        getHooksMock.mockReturnValueOnce(historyMock);
        isOnlyFlashErrorMock.mockReturnValue(true);
    });

    test.each(fatalErrorDataSet)(
        'handle error $status, with fatal Errors',
        ({status, resResponse, setApplicationStateMetaDataCalls, displayErrorCalls, dispatchCalls, setMetadataCalls, historyCall, error}) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;

            expect(() => handleErrorIfNeeded(response, dispatchMock, stateMock)).toThrow(error);

            expect(setApplicationStateMetaDataFromResponseMock).toHaveBeenCalledTimes(setApplicationStateMetaDataCalls);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(displayErrorCalls);
            expect(dispatchMock).toHaveBeenCalledTimes(dispatchCalls);
            expect(setMetadataMock).toHaveBeenCalledTimes(setMetadataCalls);
            expect(historyMock.replace).toHaveBeenCalledTimes(historyCall);
        });

    test.each(errorDataSet)(
        'handle error status, with Errors 401 and 422 - or Error displaying Flash Message',
        ({status, resResponse, setApplicationStateMetaDataCalls, errorsFromResponse , displayErrorCalls, dispatchCalls, historyCall, retrieveErrorFromResponseCall, isOnlyFlashErrorCall}) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;

            retrieveErrorFromResponseMock.mockReturnValue(errorsFromResponse as Array<IApiErrorResponse>);
            handleErrorIfNeeded(response, dispatchMock, stateMock);

            expect(setApplicationStateMetaDataFromResponseMock).toHaveBeenCalledTimes(setApplicationStateMetaDataCalls);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(displayErrorCalls);
            expect(dispatchMock).toHaveBeenCalledTimes(dispatchCalls);
            expect(historyMock.replace).toHaveBeenCalledTimes(historyCall);
            expect(retrieveErrorFromResponseMock).toHaveBeenCalledTimes(retrieveErrorFromResponseCall);
            expect(isOnlyFlashErrorMock).toHaveBeenCalledTimes(isOnlyFlashErrorCall);
        });

    test.each(sessionDataSet)(
        'handle error status, with Errors: errors',
        ({resResponse, error, status, retrieveErrorFromResponseCall}) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;
            retrieveErrorFromResponseMock.mockReturnValue(resResponse.errors as Array<IApiErrorResponse>);

            expect(() => handleErrorIfNeeded(response, dispatchMock, stateMock)).toThrow(error);
            expect(retrieveErrorFromResponseMock).toHaveBeenCalledTimes(retrieveErrorFromResponseCall);
        });

    test.each(flashErrorSet)(
        'handle $status status for flash error',
        ({status, resResponse, displayDefaultFlashErrorCalls, errorsFromResponse }) => {
            response.error = {...fetchError, status: status};
            response.response = resResponse as IApiResponse;

            retrieveErrorFromResponseMock.mockReturnValue(errorsFromResponse as Array<IApiErrorResponse>);
            handleErrorIfNeeded(response, dispatchMock, stateMock);
            expect(displayDefaultFlashErrorMock).toHaveBeenCalledTimes(displayDefaultFlashErrorCalls);
        });
});


