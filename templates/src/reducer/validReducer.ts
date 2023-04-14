import {IIsValid} from 'src/types';
import {SET_VALID, CLEAR_VALID_STATES} from 'src/action/appActionType';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {isValid} = defaultOrderInitialization;

export function validReducer(state = isValid, action: AnyAction): IIsValid {

    switch (action.type) {
        case SET_VALID:
            return {...state, [action.payload.field]: action.payload.value};
        case CLEAR_VALID_STATES:
            return isValid;
        default:
            return state;
    }
}
