import {orderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import {UPDATE_ORDER_TOTAL} from 'src/action';

const {data: {application_state}} = orderInitialization;

export function orderTotalReducer(state = application_state.order_total, action: AnyAction ): number {
    switch (action.type) {
        case UPDATE_ORDER_TOTAL: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
