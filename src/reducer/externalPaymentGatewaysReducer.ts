import {IExternalPaymentMethod} from '@bold-commerce/checkout-frontend-library';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data:{initial_data}} = defaultOrderInitialization;

export function externalPaymentGatewaysReducer(state = initial_data.external_payment_gateways, action: AnyAction ): IExternalPaymentMethod {
    switch (action.type) {
        default:
            return state;
    }
}
