import {IApplicationStateSelectShippingLine} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';
import {SET_SELECTED_SHIPPING_LINE, UPDATE_SELECTED_SHIPPING_LINE} from 'src/action';
import {AnyAction} from 'redux';

const {data: {application_state}} = orderInitialization;

export function selectShippingLineReducer(state = application_state.shipping.selected_shipping, action: AnyAction ): Partial<IApplicationStateSelectShippingLine> {
    switch (action.type) {
        case SET_SELECTED_SHIPPING_LINE:
            return action.payload.line;
        case UPDATE_SELECTED_SHIPPING_LINE:
            return action.payload.data;
        default:
            return state;
    }
}
