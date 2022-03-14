import {IApplicationStateTax} from 'src/types';
import {AnyAction} from 'redux';
import {UPDATE_TAXES} from 'src/action';
import { defaultOrderInitialization } from 'src/constants/orderInitialization';

const {data: {application_state}} = defaultOrderInitialization;

export function taxesReducer(state: Array<IApplicationStateTax> = application_state.taxes, action: AnyAction ): Array<IApplicationStateTax> {
    switch (action.type) {
        case UPDATE_TAXES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
