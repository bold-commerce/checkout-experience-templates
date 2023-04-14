import {IOverlay} from 'src/types';
import {AnyAction} from 'redux';
import {SET_OVERLAY_CONTENT, SHOW_HIDE_OVERLAY} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {overlay} = defaultOrderInitialization;

export function overlayReducer(state = overlay, action: AnyAction): IOverlay {
    switch (action.type) {
        case SET_OVERLAY_CONTENT: {
            return action.payload.content;
        }
        case SHOW_HIDE_OVERLAY: {
            return {...state , shown: action.payload.shown};
        }
        default:
            return state;

    }
}
