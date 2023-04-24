import {
    setExternalPaymentGatewayListener,
    removeExternalPaymentGatewayListener,
    IExternalPaymentGateway,
    sendExternalPaymentGatewayUpdateStateAction,
    IAddPaymentRequest, sendExternalPaymentGatewaySetConfigAction,
} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {
    actionSetExternalGatewayReady,
    actionSetButtonDisable,
    actionSetExternalPaymentGatewayLoading,
} from 'src/action';
import {IOrderInitialization, IExternalPaymentGatewayAddPayment} from 'src/types';
import {useSendEvent} from 'src/hooks';
import {addPayment, getUpdatedApplicationState} from 'src/library';

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
        sendExternalPaymentGatewaySetConfigAction(paymentGateway);
        sendExternalPaymentGatewayUpdateStateAction(paymentGateway, getState().data);
    };
}

export function handleExternalPaymentGatewayAddPayment(paymentGateway: IExternalPaymentGateway, payload: IExternalPaymentGatewayAddPayment) {
    return async function handleExternalPaymentGatewayAddPaymentThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayAddPayment');
        const paymentPayload: IAddPaymentRequest = {
            amount: payload.amount,
            currency: getState().data.application_state.currency.iso_code,
            display_string: payload.display_string,
            retain: false,
            token: payload.token,
            type: payload.type,
            gateway_public_id: paymentGateway.public_id,
        };
        await dispatch(addPayment(paymentPayload));
        dispatch(getUpdatedApplicationState);
    };
}
