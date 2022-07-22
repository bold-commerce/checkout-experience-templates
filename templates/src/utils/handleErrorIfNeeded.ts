import {apiErrors, httpStatusCode, IApiErrorResponse, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {IError, IOrderInitialization} from 'src/types';
import {
    displayFatalErrorFromTranslation,
    getCheckoutUrl,
    getHook,
    getNeuroIdPageName,
    logError,
    setApplicationStateMetaDataFromResponse,
    isOnlyFlashError,
    neuroIdSubmit,
    retrieveErrorFromResponse
} from 'src/utils';
import {actionAddError, actionShowHideOverlayContent} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {Constants} from 'src/constants';

export function handleErrorIfNeeded(response: IApiReturnObject, dispatch: Dispatch, getState: () => IOrderInitialization, addressType = ''): void {
    const error = response.error;
    setApplicationStateMetaDataFromResponse(response);

    const state = getState();
    if(error){
        switch (error.status) {
            case apiErrors.noCsrf.status:
            case apiErrors.noAppState.status:
            case apiErrors.emptyAppState.status:
            case apiErrors.noResData.status:
            case apiErrors.emptyResData.status: {
                displayFatalErrorFromTranslation(state, dispatch);
                break;
            }
            case apiErrors.general.status:
            case apiErrors.noPigiIframe.status:
            case apiErrors.errorsInResponse.status:
            case apiErrors.emptyFieldInResponse.status:
            case apiErrors.emptyKeysToCheck.status:
            case apiErrors.noFieldInResponse.status: {
                const error = retrieveErrorFromResponse(response) as IApiErrorResponse;
                if (error && isOnlyFlashError([error])) {
                    dispatch(actionAddError(error));
                }
                break;
            }
            case httpStatusCode.UNAUTHORIZED: {
                const errors = retrieveErrorFromResponse(response);
                if (errors && Array.isArray(errors)) {
                    errors.forEach(e => {
                        let message;
                        switch (e.message) {
                            case 'Expired JWT': {
                                const location = window.location.pathname.split('/');
                                const history: HistoryLocationState = getHook('history');
                                neuroIdSubmit(getNeuroIdPageName(location[location.length-1]));
                                history.replace(getCheckoutUrl(Constants.SESSION_EXPIRED_ROUTE));
                                dispatch(actionShowHideOverlayContent(false));
                                message = 'Session Expired';
                                break;
                            }
                            default: {
                                displayFatalErrorFromTranslation(state, dispatch);
                                message = 'Session Issues';
                            }
                        }
                        const sessionError = new Error(message);
                        sessionError.name = 'SessionError';
                        throw sessionError;
                    });
                }
                break;
            }
            case httpStatusCode.UNPROCESSABLE_ENTITY: {
                const errors = retrieveErrorFromResponse(response);
                if (errors && Array.isArray(errors)) {
                    errors.forEach(e => {
                        const error: IError = Object.assign(e , {address_type: addressType});
                        dispatch(actionAddError(error));
                    });
                }
                break;
            }
            default:
                logError(error, [{section: 'lib_api_return_object', values: response as unknown as {[key: string]: unknown}}]);
        }
    }
}
