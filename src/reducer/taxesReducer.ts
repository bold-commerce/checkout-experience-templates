import {IApplicationStateTax} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import {UPDATE_TAXES} from 'src/action';

const {data: {application_state}} = orderInitialization;

export function taxesReducer(state = application_state.taxes, action: AnyAction ): Array<IApplicationStateTax> {
    switch (action.type) {
        case UPDATE_TAXES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
