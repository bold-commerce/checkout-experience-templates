import {orderInitialization} from 'src/constants/orderInitialization';
import {IOverlay} from 'src/types';
import {AnyAction} from 'redux';
import {SET_OVERLAY_CONTENT, SHOW_HIDE_OVERLAY} from 'src/action';

const orderData = orderInitialization;

export function overlayReducer(state = orderData.overlay, action: AnyAction): IOverlay {
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
