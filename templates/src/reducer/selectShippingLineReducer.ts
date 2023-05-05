import {SET_SELECTED_SHIPPING_LINE, UPDATE_SELECTED_SHIPPING_LINE} from 'src/action';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';

const {data: {application_state}} = defaultOrderInitialization;

export function selectShippingLineReducer(state = application_state.shipping.selected_shipping, action: AnyAction ): IShippingLine {
    switch (action.type) {
        case SET_SELECTED_SHIPPING_LINE:
            return action.payload.line;
        case UPDATE_SELECTED_SHIPPING_LINE:
            return action.payload.data;
        default:
            return state;
    }
}
