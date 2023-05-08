import {IAlternativePaymentMethod} from '@boldcommerce/checkout-frontend-library';
import {AnyAction} from 'redux';
import {UPDATE_PAYMENT_METHOD} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data:{initial_data}} = defaultOrderInitialization;

export function paymentMethodReducer(state = initial_data.alternative_payment_methods, action: AnyAction ): IAlternativePaymentMethod {
    switch (action.type) {
        case UPDATE_PAYMENT_METHOD: {
            return action.payload.data;
        }
        default:
            return state;

    }
}
