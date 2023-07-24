import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {UPDATE_NOTES} from 'src/action';
import {AnyAction} from 'redux';

const {data:{application_state}} = defaultOrderInitialization;

export function notesReducer(state = application_state.order_meta_data.notes, action: AnyAction): string {
    switch (action.type) {
        case UPDATE_NOTES:
            return action.payload.data;
        default:
            return state;
    }
}
