import {orderInitialization} from 'src/constants/orderInitialization';
import {UPDATE_SHIPPING_LINES_DISCOUNT, UPDATE_SHIPPING_LINES_TAXES} from 'src/action';
import {AnyAction} from 'redux';
import {IApplicationStateDiscount, IApplicationStateTax} from 'src/types';

const {data: {application_state}} = orderInitialization;

export function shippingLineItemTaxesReducer(state = application_state.shipping.taxes, action: AnyAction): Array<IApplicationStateTax> {
    switch (action.type) {
        case UPDATE_SHIPPING_LINES_TAXES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}

export function shippingLineItemDiscountReducer(state = application_state.shipping.discounts, action: AnyAction): Array<IApplicationStateDiscount> {
    switch (action.type) {
        case UPDATE_SHIPPING_LINES_DISCOUNT: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
