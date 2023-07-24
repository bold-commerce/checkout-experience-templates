import {UPDATE_NOTE_ATTRIBUTE_FIELD, UPDATE_NOTE_ATTRIBUTES} from 'src/action/appActionType';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';

const {data:{application_state}} = defaultOrderInitialization;

export function noteAttributesReducer(state = application_state.order_meta_data.note_attributes, action: AnyAction): ICartParameters {
    switch (action.type) {
        case UPDATE_NOTE_ATTRIBUTE_FIELD:
            return {...state, [action.payload.field]: action.payload.value};
        case UPDATE_NOTE_ATTRIBUTES:
            return action.payload.data;
        default:
            return state;
    }
}
