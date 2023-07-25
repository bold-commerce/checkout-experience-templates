import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';
import {UPDATE_CART_PARAMETERS} from 'src/action';
import {AnyAction} from 'redux';

const {data:{application_state}} = defaultOrderInitialization;

export function cartParametersReducer(state = application_state.order_meta_data.cart_parameters, action: AnyAction): ICartParameters {
    switch (action.type) {
        case UPDATE_CART_PARAMETERS:
            return action.payload.data;
        default:
            return state;
    }
}
