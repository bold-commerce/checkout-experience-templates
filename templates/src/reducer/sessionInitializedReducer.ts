import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import {SET_SESSION_INITIALIZED} from 'src/action';

const {isSessionInitialized} = defaultOrderInitialization;

export function sessionInitializedReducer(state = isSessionInitialized, action: AnyAction ): boolean {
    switch (action.type) {
        case SET_SESSION_INITIALIZED: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
