import {AnyAction} from 'redux';
import * as AppActionsType from 'src/action/appActionType';
import {IError} from 'src/types';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {errors} = defaultOrderInitialization;

export function errorsReducer(state = errors, action: AnyAction ) : Array<IError> {
    const getDifferentErrors = (error: IError ) =>
        error.type !== action.payload.type
        || error.field !== action.payload.field
        || error.severity !== action.payload.severity
        || error.sub_type !== action.payload.sub_type
        || error.address_type !== action.payload.address_type;

    switch (action.type) {
        case AppActionsType.ADD_ERROR: {
            const newState = state.filter(getDifferentErrors);
            newState.push(action.payload);
            return newState;
        }
        case AppActionsType.REMOVE_ERROR:
            return state.filter(getDifferentErrors);
        case AppActionsType.REMOVE_ERROR_BY_FIELD:
            return state.filter(error => (!(error.field === action.payload.field && error.address_type === action.payload.addressType)));
        case AppActionsType.REMOVE_ERROR_BY_TYPE:
            return state.filter(error => (!(error.type === action.payload.type && error.address_type === action.payload.addressType)));
        case AppActionsType.REMOVE_ERROR_BY_TYPE_AND_CODE:
            return state.filter(error => (!(error.type === action.payload.type && error.code === action.payload.code && error.address_type === action.payload.addressType)));
        case AppActionsType.REMOVE_ERROR_BY_ADDRESS_TYPE:
            return state.filter(error => (!(error.address_type === action.payload.addressType)));
        case AppActionsType.CLEAR_ERRORS:
            return [];
        default:
            return state;
    }
}
