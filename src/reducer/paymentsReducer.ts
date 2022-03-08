import {AnyAction} from 'redux';
import * as AppActionsType from '../action/appActionType';
import {IApplicationStatePayment} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';

const {data:{application_state}} = orderInitialization;

export function paymentsReducer(state = application_state.payments, action: AnyAction ) : Array<IApplicationStatePayment> {
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
