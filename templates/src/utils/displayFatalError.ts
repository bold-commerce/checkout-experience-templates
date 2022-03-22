import {IOverlay} from 'src/types';
import {actionSetOverlayContent} from 'src/action';
import {Dispatch} from 'redux';

export function displayFatalError(dispatch: Dispatch): void{

    const headerError = 'Looks like something went wrong';
    const contentError = 'We\'ve been notified and we\'re working on a solution';
    const backButton = 'Go back';
    const overlay: IOverlay = {shown: true, inverted: false, header: headerError, content: contentError, buttonText: backButton};
    dispatch(actionSetOverlayContent(overlay));

}
