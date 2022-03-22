import {IApplicationStateLineItem} from 'src/types';
import {AnyAction} from 'redux';
import {UPDATE_LINE_ITEMS} from 'src/action';
import { defaultOrderInitialization } from 'src/constants/orderInitialization';

const {data: {application_state}} = defaultOrderInitialization;

export function lineItemsReducer(state = application_state.line_items, action: AnyAction ): Array<IApplicationStateLineItem> {
    switch (action.type) {
        case UPDATE_LINE_ITEMS: {
            return action.payload.line;
        }
        default:
            return state;
    }
}
