import {IApplicationStateOrderMetaData} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import * as AppActionsType from 'src/action/appActionType';

const {data:{application_state}} = orderInitialization;

export function orderMetaReducer(state = application_state.order_meta_data, action: AnyAction): IApplicationStateOrderMetaData {
    switch (action.type) {
        case AppActionsType.UPDATE_ORDER_META_DATA:
            return action.payload.data;
        default:
            return state;
    }
}
