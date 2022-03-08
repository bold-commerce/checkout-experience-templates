import {IApplicationStateSelectShippingLine} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import {UPDATE_AVAILABLE_SHIPPING_LINES} from 'src/action';

const {data:{application_state}} = orderInitialization;

export function availableShippingLinesReducer(state = application_state.shipping.available_shipping_lines, action: AnyAction) : Array<IApplicationStateSelectShippingLine> {
    switch (action.type) {
        case UPDATE_AVAILABLE_SHIPPING_LINES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
