import {orderInitialization} from 'src/constants/orderInitialization';
import {IIsValid} from 'src/types';
import {SET_VALID} from 'src/action/appActionType';
import {AnyAction} from 'redux';

const {isValid} = orderInitialization;

export function validReducer(state = isValid, action: AnyAction): IIsValid {

    switch (action.type) {
        case SET_VALID:
            return {...state, [action.payload.field]: action.payload.value};
        default:
            return state;
    }
}
