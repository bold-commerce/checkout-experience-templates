import {IApplicationStateOrderMetaData} from 'src/types';
import {AnyAction} from 'redux';
import * as AppActionsType from 'src/action/appActionType';
import { defaultOrderInitialization } from 'src/constants/orderInitialization';

const {data:{application_state}} = defaultOrderInitialization;

export function orderMetaReducer(state = application_state.order_meta_data, action: AnyAction): IApplicationStateOrderMetaData {
    switch (action.type) {
        case AppActionsType.UPDATE_ORDER_META_DATA:
            return action.payload.data;
        default:
            return state;
    }
}
