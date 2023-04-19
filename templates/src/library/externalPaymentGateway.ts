import {
    setExternalPaymentGatewayListener,
    removeExternalPaymentGatewayListener,
    IExternalPaymentGateway,
    sendExternalPaymentGatewayUpdateStateAction
} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {
    actionSetExternalGatewayReady,
    actionSetButtonDisable,
    actionSetExternalPaymentGatewayLoading,
} from 'src/action';
import {IOrderInitialization} from 'src/types';
import {useSendEvent} from 'src/hooks';

export function setExternalPaymentGatewayListenerInLibrary(paymentGateway: IExternalPaymentGateway, callbackEvent: (evt: Event) => void) {
    return async function setExternalPaymentGatewayListenerThunk(): Promise<void> {
        await setExternalPaymentGatewayListener(paymentGateway, callbackEvent);
    };
}

export function removeExternalPaymentGatewayListenerInLibrary() {
    return async function setExternalPaymentGatewayListenerThunk(): Promise<void> {
        await removeExternalPaymentGatewayListener();
    };
}

export function handleExternalPaymentGatewayInitialized(paymentGateway: IExternalPaymentGateway) {
    return async function handleExternalPaymentGatewayInitializedThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayInitialized');
        dispatch(actionSetExternalGatewayReady(paymentGateway, true));
        dispatch(actionSetButtonDisable('paymentPageButton', false));
        dispatch(actionSetExternalPaymentGatewayLoading(paymentGateway, false));
        sendExternalPaymentGatewayUpdateStateAction(paymentGateway, getState().data);
    };
}
