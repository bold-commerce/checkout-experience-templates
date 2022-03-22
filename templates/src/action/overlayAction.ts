import {AnyAction} from 'redux';
import {SET_OVERLAY_CONTENT, SHOW_HIDE_OVERLAY} from 'src/action/';
import {IOverlay} from 'src/types';

export function actionSetOverlayContent (content: IOverlay): AnyAction{
    return {
        type: SET_OVERLAY_CONTENT,
        payload: {content}
    };
}

export function actionShowHideOverlayContent (shown: boolean): AnyAction{
    return {
        type: SHOW_HIDE_OVERLAY,
        payload: {shown}
    };
}
