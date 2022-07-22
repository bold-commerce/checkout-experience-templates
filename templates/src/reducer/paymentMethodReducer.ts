import {AnyAction} from 'redux';
import { defaultOrderInitialization } from 'src/constants/orderInitialization';
import {IAlternatePaymentMethod} from '@bold-commerce/checkout-frontend-library';
import {UPDATE_PAYMENT_METHOD} from 'src/action';

const {data:{initial_data}} = defaultOrderInitialization;

export function paymentMethodReducer(state = initial_data.alternate_payment_methods, action: AnyAction ): IAlternatePaymentMethod | undefined{
    switch (action.type) {
        case UPDATE_PAYMENT_METHOD: {
            return action.payload.data;
        }
        default:
            return state;

    }
}
