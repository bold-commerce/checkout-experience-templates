import {IIsButtonDisable} from 'src/types';
import {SET_BUTTON_DISABLE} from 'src/action/appActionType';
import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {isButtonDisable} = defaultOrderInitialization;

export function buttonDisableReducer(state = isButtonDisable, action: AnyAction): IIsButtonDisable {

    switch (action.type) {
        case SET_BUTTON_DISABLE:
            return {...state, [action.payload.field]: action.payload.value};
        default:
            return state;
    }
}
