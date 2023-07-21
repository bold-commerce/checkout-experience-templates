import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import {UPDATE_TAGS} from 'src/action';

const {data:{application_state}} = defaultOrderInitialization;

export function tagsReducer(state = application_state.order_meta_data.tags, action: AnyAction): Array<string> {
    switch (action.type) {
        case UPDATE_TAGS:
            return action.payload.data;
        default:
            return state;
    }
}
