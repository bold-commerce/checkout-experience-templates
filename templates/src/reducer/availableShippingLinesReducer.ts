import {AnyAction} from 'redux';
import {UPDATE_AVAILABLE_SHIPPING_LINES} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';

const {data:{application_state}} = defaultOrderInitialization;

export function availableShippingLinesReducer(state = application_state.shipping.available_shipping_lines, action: AnyAction) : Array<IShippingLine> {
    switch (action.type) {
        case UPDATE_AVAILABLE_SHIPPING_LINES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
