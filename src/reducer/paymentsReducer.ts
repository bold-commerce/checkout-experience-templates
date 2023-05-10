import {AnyAction} from 'redux';
import * as AppActionsType from '../action/appActionType';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IPayment} from '@boldcommerce/checkout-frontend-library';

const {data:{application_state}} = defaultOrderInitialization;

export function paymentsReducer(state = application_state.payments, action: AnyAction ) : Array<IPayment> {
    switch (action.type) {
        // To be added in another MR
        case AppActionsType.ADD_PAYMENT:
            return state;
        case AppActionsType.REMOVE_PAYMENT:
            return state.filter((element) => element.id !== action.payload.id);
        case AppActionsType.UPDATE_PAYMENT:
            return action.payload.data;
        default:
            return state;
    }
}
