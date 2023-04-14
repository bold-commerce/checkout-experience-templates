import {AnyAction} from 'redux';
import {UPDATE_ORDER_TOTAL} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data: {application_state}} = defaultOrderInitialization;

export function orderTotalReducer(state = application_state.order_total, action: AnyAction ): number {
    switch (action.type) {
        case UPDATE_ORDER_TOTAL: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
