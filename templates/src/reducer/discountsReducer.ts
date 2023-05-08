import {AnyAction} from 'redux';
import * as AppActionsType from '../action/appActionType';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IDiscount} from '@boldcommerce/checkout-frontend-library';

const {data:{application_state}} = defaultOrderInitialization;

export function discountsReducer(state = application_state.discounts, action: AnyAction ): Array<IDiscount> {
    switch (action.type) {
        // to be modified in another MR
        case AppActionsType.ADD_DISCOUNT:
            if (action.payload.valid && state.filter(discount => discount.code === action.payload.code).length === 0) {
                return [...state, action.payload];
            }
            return state;
        case AppActionsType.REMOVE_DISCOUNT:
            return state.filter((element) => element.code !== action.payload.code);
        case AppActionsType.UPDATE_DISCOUNTS:
            return action.payload.data;
        default:
            return state;
    }
}
