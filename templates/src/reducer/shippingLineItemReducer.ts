import {UPDATE_SHIPPING_LINES_DISCOUNT, UPDATE_SHIPPING_LINES_TAXES} from 'src/action';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IDiscount, ITax} from '@boldcommerce/checkout-frontend-library';

const {data: {application_state}} = defaultOrderInitialization;

export function shippingLineItemTaxesReducer(state: Array<ITax> = application_state.shipping.taxes, action: AnyAction): Array<ITax> {
    switch (action.type) {
        case UPDATE_SHIPPING_LINES_TAXES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}

export function shippingLineItemDiscountReducer(state: Array<IDiscount> = application_state.shipping.discounts, action: AnyAction): Array<IDiscount> {
    switch (action.type) {
        case UPDATE_SHIPPING_LINES_DISCOUNT: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
