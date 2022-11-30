import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionSetButtonDisable, actionSetPigiIframeLoader} from 'src/action';

export function checkLoadPigiErrors(pigiSetStateFunction: () => void) {
    return async function checkLoadPigiErrorsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        const pigiInitialized = state.isValid.pigi;
        if (!pigiInitialized) {
            pigiSetStateFunction();
            dispatch(actionSetPigiIframeLoader(false));
            dispatch(actionSetButtonDisable('paymentPageButton', true));
        }
    };
}
