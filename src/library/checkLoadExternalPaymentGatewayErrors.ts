import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionSetButtonDisable} from 'src/action';
import {IExternalPaymentGateway} from '@boldcommerce/checkout-frontend-library';

export function checkLoadExternalPaymentGatewayErrors(gateway: IExternalPaymentGateway, externalSetStateFunction: () => void) {
    return async function checkLoadExternalErrorsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const externalInitialized = getState().externalPaymentGateways.isValid.has(gateway.public_id);
        if (!externalInitialized) {
            externalSetStateFunction();
            dispatch(actionSetButtonDisable('paymentPageButton', true));
        }
    };
}
