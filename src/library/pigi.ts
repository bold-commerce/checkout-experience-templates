import {sendUpdateLanguageAction, setPigiListener} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {actionSetPigiDisplaySca, actionSetPigiIframeLoader, actionShowHideOverlayContent} from 'src/action';
import {pigiHandleScaSteps, pigiPaymentTypes} from 'src/constants';
import {displayOrderProcessingScreen, getUpdatedApplicationState, processOrder} from 'src/library';
import {IOrderInitialization, IPigiResponsesPayload} from 'src/types';
import {updatePigiHeight} from 'src/utils';

export function setPigiListenerInLibrary(frameId: string, callbackEvent: (evt: Event) => void) {
    return async function setPigiListenerThunk(): Promise<void> {
        await setPigiListener(frameId, callbackEvent);
    };
}

export function handlePigiInitialized() {
    return async function handlePigiInitializedThunk(dispatch: Dispatch): Promise<void> {
        dispatch(actionSetPigiIframeLoader(false));
    };
}

export function handlePigiAddPayment(payload: IPigiResponsesPayload, history: History) {
    return async function handlePigiAddPaymentThunk(dispatch: Dispatch): Promise<void> {
        dispatch(getUpdatedApplicationState);
        if(payload.success && payload.paymentType !== pigiPaymentTypes.GIFT_CARD) {
            if(payload.paymentType === pigiPaymentTypes.PAYPAL){
                dispatch(displayOrderProcessingScreen);
            }
            dispatch(processOrder(history));
        } else {
            dispatch(actionShowHideOverlayContent(false));
        }
    };
}

export function handlePigiPaymentAdded() {
    return async function handlePigiAddPaymentThunk(dispatch: Dispatch): Promise<void> {
        dispatch(getUpdatedApplicationState);
    };
}

export function handlePigiSca(payload: IPigiResponsesPayload) {
    return async function handlePigiScaThunk(dispatch: Dispatch): Promise<void> {
        if (payload.step === pigiHandleScaSteps.DISPLAYED) {
            dispatch(actionShowHideOverlayContent(false));
            window.scrollTo(0, 0);
            updatePigiHeight('100%');
            dispatch(actionSetPigiDisplaySca(true));
        } else if (payload.step === pigiHandleScaSteps.COMPLETED) {
            dispatch(actionShowHideOverlayContent(true));
            dispatch(actionSetPigiDisplaySca(false));
        } else if (payload.step === pigiHandleScaSteps.FAILED) {
            dispatch(actionSetPigiDisplaySca(false));
            updatePigiHeight(`${payload.height}px`);
            dispatch(actionShowHideOverlayContent(false));
        }
    };
}

export function handlePigiRefreshOrder() {
    return async function handlePigiRefreshOrderThunk(dispatch: Dispatch): Promise<void> {
        dispatch(getUpdatedApplicationState);
    };
}

export function handlePigiHeight(payload: IPigiResponsesPayload) {
    return async function handlePigiRefreshOrderThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const {appSetting: {pigiDisplaySca}} = getState();
        if (pigiDisplaySca) {
            updatePigiHeight('100%');
        } else {
            updatePigiHeight(`${payload.height}px`);
        }
    };
}

export function updatePigiLanguage(){
    return async function setPigiListenerThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const {appSetting: {languageIso}} = getState();
        await sendUpdateLanguageAction(languageIso);
    };
}
