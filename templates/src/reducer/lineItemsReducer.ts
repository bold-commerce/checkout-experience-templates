import {AnyAction} from 'redux';
import {UPDATE_LINE_ITEMS} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ILineItem} from '@boldcommerce/checkout-frontend-library';

const {data: {application_state}} = defaultOrderInitialization;

export function lineItemsReducer(state = application_state.line_items, action: AnyAction ): Array<ILineItem> {
    switch (action.type) {
        case UPDATE_LINE_ITEMS: {
            return action.payload.line;
        }
        default:
            return state;
    }
}
