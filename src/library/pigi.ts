import {sendUpdateLanguageAction, setPigiListener, removePigiListener} from '@boldcommerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {
    actionSetAllowNavigation,
    actionSetAppStateValid,
    actionSetButtonDisable,
    actionSetPigiDisplaySca,
    actionSetPigiIframeLoader,
    actionShowHideOverlayContent
} from 'src/action';
import {Constants, pigiHandleScaSteps, pigiPaymentTypes} from 'src/constants';
import {displayOrderProcessingScreen, getUpdatedApplicationState, processOrder, sendPaymentEvent} from 'src/library';
import {IOrderInitialization, IPigiResponsesPayload} from 'src/types';
import {getCheckoutUrl, updatePigiHeight} from 'src/utils';

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
        dispatch(actionSetAppStateValid('pigi', true));
        dispatch(actionSetButtonDisable('paymentPageButton', false));
        dispatch(actionSetPigiIframeLoader(false));
    };
}

export function handlePigiAddPayment(payload: IPigiResponsesPayload, history: History) {
    return async function handlePigiAddPaymentThunk(dispatch: Dispatch): Promise<void> {
        await dispatch(getUpdatedApplicationState);
        if(payload.success && payload.paymentType !== pigiPaymentTypes.GIFT_CARD) {
            dispatch(sendPaymentEvent);
            if(payload.paymentType === pigiPaymentTypes.PAYPAL){
                dispatch(displayOrderProcessingScreen);
            }
            dispatch(processOrder(history));
        } else {
            dispatch(actionShowHideOverlayContent(false));
            dispatch(actionSetPigiDisplaySca(false));
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
        if (payload.step === pigiHandleScaSteps.REDIRECT && payload?.data?.url) {
            dispatch(actionSetAllowNavigation());
            const scaUrl = payload.data.url as string;
            const resumeUrl = 'https://' + window.location.host + getCheckoutUrl(Constants.PROCESS_ROUTE);
            // Use setTimeout to put the navigation in the event loop so it runs after the react state updates
            setTimeout(() => {
                window.location.href = scaUrl + '&redirect_uri=' + encodeURIComponent(resumeUrl+'?skipInventory=1');
            });
        } else if (payload.step === pigiHandleScaSteps.DISPLAYED) {
            window.scrollTo(0, 0);
            updatePigiHeight('100%');
            dispatch(actionSetPigiDisplaySca(true));
            dispatch(actionShowHideOverlayContent(false));
        } else if (payload.step === pigiHandleScaSteps.COMPLETED) {
            dispatch(actionShowHideOverlayContent(true));
            dispatch(actionSetPigiDisplaySca(false));
            if (scaToken) {
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

export function handlePigiHeight(payload: IPigiResponsesPayload) {
    return async function handlePigiHeightThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
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
