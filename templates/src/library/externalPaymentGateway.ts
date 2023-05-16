import {
    IAddPaymentRequest,
    IAddress,
    IExternalPaymentGateway,
    removeExternalPaymentGatewayListener,
    sendExternalPaymentGatewaySetConfigAction,
    sendExternalPaymentGatewayUpdateBillingAddressAction,
    sendExternalPaymentGatewayUpdateLanguageAction,
    sendExternalPaymentGatewayUpdateShippingAddressAction,
    sendExternalPaymentGatewayUpdateStateAction,
    setExternalPaymentGatewayListener,
} from '@boldcommerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {
    actionSetButtonDisable,
    actionSetExternalGatewayReady,
    actionSetExternalPaymentGatewayLoading,
    actionSetLoaderAndDisableButton
} from 'src/action';
import {Constants} from 'src/constants';
import {useSendEvent} from 'src/hooks';
import {addPayment, getUpdatedApplicationState} from 'src/library';
import {
    IExternalPaymentGatewayAddPayment,
    IExternalPaymentGatewayUpdateHeight,
    IOrderInitialization,
} from 'src/types';
import {updateExternalPaymentGatewayHeight} from 'src/utils/updateExternalPaymentGatewayHeight';

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

export function handleExternalPaymentGatewayUpdateHeight(paymentGateway: IExternalPaymentGateway, payload: IExternalPaymentGatewayUpdateHeight) {
    return async function handleExternalPaymentGatewayUpdateHeightThunk(): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayUpdateHeight');
        updateExternalPaymentGatewayHeight(`${payload.height}px`, paymentGateway.public_id);
    };
}

export function handleExternalPaymentGatewayRefreshOrder() {
    return async function handleExternalPaymentGatewayRefreshThunk(dispatch: Dispatch): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayRefreshOrder');
        dispatch(getUpdatedApplicationState);
    };
}

export function updateExternalPaymentGatewayLanguage(){
    return async function updateExternalPaymentGatewayLanguageThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const {appSetting: {languageIso}} = getState();
        const externalPaymentGateways = getAllExternalPaymentGateways(getState);

        await externalPaymentGateways.forEach(async (externalPaymentgateway) => {
            await sendExternalPaymentGatewayUpdateLanguageAction(externalPaymentgateway, languageIso);
        });
    };
}

export function updateExternalPaymentGatewayBillingAddress(payload: IAddress) {
    return async function updateExternalPaymentGatewaybillingAddressThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayUpdatedBillingAddress');
        const externalPaymentGateways = getAllExternalPaymentGateways(getState);

        await externalPaymentGateways.forEach(async (externalPaymentgateway) => {
            await sendExternalPaymentGatewayUpdateBillingAddressAction(externalPaymentgateway, payload);
        });
    };
}

export function updateExternalPaymentGatewayShippingAddress(payload: IAddress) {
    return async function updateExternalPaymentGatewayShippingAddressThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayUpdatedShippingAddress');
        const externalPaymentGateways = getAllExternalPaymentGateways(getState);

        await externalPaymentGateways.forEach(async (externalPaymentgateway) => {
            await sendExternalPaymentGatewayUpdateShippingAddressAction(externalPaymentgateway, payload);
        });

    };
}

export function getAllExternalPaymentGateways(getState: () => IOrderInitialization) {
    const externalPaymentGatewaysInfo = getState().data.initial_data.external_payment_gateways;

    return externalPaymentGatewaysInfo.filter(externalPaymentGatewayInfo =>
        externalPaymentGatewayInfo.location === Constants.PAYMENT_METHOD_BELOW ||
        externalPaymentGatewayInfo.location === Constants.CUSTOMER_INFO_ABOVE);
}

export function handleExternalPaymentGatewayTokenizingInProgress() {
    return async function handleExternalPaymentGatewayTokenizingInProgressThunk(dispatch: Dispatch): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayTokenizingInProgress');
        dispatch(actionSetLoaderAndDisableButton('paymentButton', true));
    };
}

export function handleExternalPaymentGatewayTokenizingCompleted() {
    return async function handleExternalPaymentGatewayTokenizingCompletedThunk(dispatch: Dispatch): Promise<void> {
        useSendEvent('CheckoutExperienceExternalPaymentGatewayTokenizingCompleted');
        dispatch(actionSetLoaderAndDisableButton('paymentButton', false));
    };
}