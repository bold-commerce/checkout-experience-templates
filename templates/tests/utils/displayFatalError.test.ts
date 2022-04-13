import {IOverlay} from 'src/types';
import {Dispatch} from 'redux';
import {displayFatalError} from 'src/utils';
import * as overlayAction from 'src/action/overlayAction';
import {SET_OVERLAY_CONTENT} from 'src/action';
import SpyInstance = jest.SpyInstance;

describe('Test displayFatalError function', () => {
    let dispatch: Dispatch;
    let setOverlayContentSpy: SpyInstance;

    beforeEach(() => {
        jest.restoreAllMocks();
        dispatch = jest.fn();
        setOverlayContentSpy = jest.spyOn(overlayAction, 'actionSetOverlayContent');
    });

    test('function called with OverlayPayload populated', () => {
        const overlayPayload: IOverlay = {
            header: 'Looks like something went wrong',
            content: 'We\'ve been notified and we\'re working on a solution',
            buttonText: 'Go back',
            shown: true,
            inverted: false
        };
        const returnSetOverlayContentAction = {
            type: SET_OVERLAY_CONTENT,
            payload: overlayPayload
        };
        setOverlayContentSpy.mockReturnValueOnce(returnSetOverlayContentAction);
        displayFatalError(dispatch);
        expect(setOverlayContentSpy).toHaveBeenCalledTimes(1);
        expect(setOverlayContentSpy).toHaveBeenCalledWith(overlayPayload);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(returnSetOverlayContentAction);
    });
});
