import {IExternalPaymentGateways as IExternalPaymentGatewaysInitialData} from '@boldcommerce/checkout-frontend-library';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {SET_EXTERNAL_PAYMENT_GATEWAY_LOADING, SET_EXTERNAL_PAYMENT_GATEWAY_VALID} from 'src/action';
import {IExternalPaymentGateways} from 'src/types';

const {data: {initial_data}, externalPaymentGateways} = defaultOrderInitialization;

export function externalPaymentGatewaysReducer(state = externalPaymentGateways, action: AnyAction): IExternalPaymentGateways {
    switch (action.type) {
        case SET_EXTERNAL_PAYMENT_GATEWAY_LOADING:
            if (action.payload.value) {
                state.isLoading.add(action.payload.gateway.public_id);
            } else {
                state.isLoading.delete(action.payload.gateway.public_id);
            }
            return state;
        case SET_EXTERNAL_PAYMENT_GATEWAY_VALID:
            if (action.payload.value) {
                state.isValid.add(action.payload.gateway.public_id);
            } else {
                state.isValid.delete(action.payload.gateway.public_id);
            }
            return state;
        default:
            return state;
    }
}

export function externalPaymentGatewayInitialDataReducer(state = initial_data.external_payment_gateways): IExternalPaymentGatewaysInitialData {
    return state;
}