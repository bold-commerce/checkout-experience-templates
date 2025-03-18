import {IOnUpdateVisuals} from 'src/types';
import {Dispatch} from 'redux';
import {actionShowHideOverlayContent} from 'src/action';

export async function onUpdateVisuals(dispatch: Dispatch, payload: IOnUpdateVisuals): Promise<void> {
    if (payload.fullscreen) {
        dispatch(actionShowHideOverlayContent(false));
    }
}
