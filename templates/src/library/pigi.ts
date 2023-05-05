import {sendUpdateLanguageAction, setPigiListener, removePigiListener} from '@boldcommerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {
    actionSetAppStateValid,
    actionSetButtonDisable,
    actionSetPigiDisplaySca,
    actionSetPigiIframeLoader,
    actionShowHideOverlayContent
} from 'src/action';
import {pigiHandleScaSteps, pigiPaymentTypes} from 'src/constants';
import {displayOrderProcessingScreen, getUpdatedApplicationState, processOrder} from 'src/library';
import {IOrderInitialization, IPigiResponsesPayload} from 'src/types';
import {updatePigiHeight} from 'src/utils';
import {useSendEvent} from 'src/hooks';

export function setPigiListenerInLibrary(frameId: string, callbackEvent: (evt: Event) => void) {
    return async function setPigiListenerThunk(): Promise<void> {
        await setPigiListener(frameId, callbackEvent);
    };
}

export function removePigiListenerInLibrary() {
    return async function setPigiListenerThunk(): Promise<void> {
        await removePigiListener();
    };
}

export function handlePigiInitialized() {
    return async function handlePigiInitializedThunk(dispatch: Dispatch): Promise<void> {
        // Beginning of sending event to back-end
        useSendEvent('CheckoutExperiencePigiInitialized');
        // of sending event to back-end
        dispatch(actionSetAppStateValid('pigi', true));
        dispatch(actionSetButtonDisable('paymentPageButton', false));
        dispatch(actionSetPigiIframeLoader(false));
    };
}

export function handlePigiAddPayment(payload: IPigiResponsesPayload, history: History) {
    return async function handlePigiAddPaymentThunk(dispatch: Dispatch): Promise<void> {
        await dispatch(getUpdatedApplicationState);
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

export function handlePigiSca(payload: IPigiResponsesPayload, history: History) {
    return async function handlePigiScaThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const {isValid: {scaToken}} = getState();
        if (payload.step === pigiHandleScaSteps.DISPLAYED) {
            window.scrollTo(0, 0);
            updatePigiHeight('100%');
            dispatch(actionSetPigiDisplaySca(true));
            dispatch(actionShowHideOverlayContent(false));
        } else if (payload.step === pigiHandleScaSteps.COMPLETED) {
            dispatch(actionShowHideOverlayContent(true));
            dispatch(actionSetPigiDisplaySca(false));
            if(scaToken) {
                dispatch(actionSetAppStateValid('scaToken', false));
                dispatch(processOrder(history));
            }
        } else if (payload.step === pigiHandleScaSteps.FAILED) {
            dispatch(actionShowHideOverlayContent(true));
            dispatch(getUpdatedApplicationState).then(() => {
                dispatch(actionSetPigiDisplaySca(false));
                updatePigiHeight(`${payload.height}px`);
                dispatch(actionShowHideOverlayContent(false));
            });
        }
    };
}

export function handlePigiDisplayFullPage() {
    return async function handlePigiDisplayFullPageThunk(dispatch: Dispatch): Promise<void> {
        window.scrollTo(0, 0);
        updatePigiHeight('100%');
        dispatch(actionSetPigiDisplaySca(true));
        dispatch(actionShowHideOverlayContent(false));
    };
}

export function handlePigiDisplayFullPageDone(payload: IPigiResponsesPayload) {
    return async function handlePigiDisplayFullPageDoneThunk(dispatch: Dispatch): Promise<void> {
        dispatch(actionShowHideOverlayContent(true));
        dispatch(getUpdatedApplicationState).then(() => {
            dispatch(actionSetPigiDisplaySca(false));
            updatePigiHeight(`${payload.height}px`);
            dispatch(actionShowHideOverlayContent(false));
        });
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
            updatePigiHeight(`${Math.ceil(payload.height)}px`);
        }
    };
}

export function updatePigiLanguage(){
    return async function setPigiListenerThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const {appSetting: {languageIso}} = getState();
        await sendUpdateLanguageAction(languageIso);
    };
}
