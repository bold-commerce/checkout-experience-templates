import {apiErrors, httpStatusCode, IApiReturnObject, IFetchError} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {IError, IOrderInitialization} from 'src/types';
import {displayFatalErrorFromTranslation, getCheckoutUrl, getHook, getNeuroIdPageName, neuroIdSubmit, retrieveErrorFromResponse} from 'src/utils';
import {actionAddError, actionShowHideOverlayContent} from 'src/action';
import {HistoryLocationState} from 'react-router';

export function handleErrorIfNeeded(response: IApiReturnObject, dispatch: Dispatch, getState: () => IOrderInitialization, addressType = ''): void {
    const error: IFetchError = response.error;

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
                //TODO: add flash error exception
                break;
            }
            case httpStatusCode.UNAUTHORIZED: {
                const errors = retrieveErrorFromResponse(response);
                if (errors && Array.isArray(errors)) {
                    errors.forEach(e => {
                        switch (e.message) {
                            case 'Expired JWT': {
                                const location = window.location.pathname.split('/');
                                const history: HistoryLocationState = getHook('history');
                                neuroIdSubmit(getNeuroIdPageName(location[location.length-1]));
                                history.replace(getCheckoutUrl('/session_expired'));
                                dispatch(actionShowHideOverlayContent(false));
                                throw new Error('Session Expired');
                            }
                            default: {
                                displayFatalErrorFromTranslation(state, dispatch);
                                throw new Error('Session Issues');
                            }
                        }
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
                // eslint-disable-next-line no-console
                console.error(error); //TODO: unhandled exception
        }
    }
}
