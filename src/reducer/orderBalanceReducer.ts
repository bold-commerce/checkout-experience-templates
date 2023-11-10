import {AnyAction} from 'redux';
import {UPDATE_ORDER_BALANCE} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data: {application_state}} = defaultOrderInitialization;

export function orderBalanceReducer(state = application_state.order_balance, action: AnyAction ): number {
    switch (action.type) {
        case UPDATE_ORDER_BALANCE: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
