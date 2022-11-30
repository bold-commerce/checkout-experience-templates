import {IOverlay} from 'src/types';
import {Dispatch} from 'redux';
import {SET_OVERLAY_CONTENT, actionSetOverlayContent} from 'src/action';
import {displayFatalError} from 'src/utils';
import {mocked} from 'jest-mock';

jest.mock('src/action/overlayAction');
const actionSetOverlayContentMock = mocked(actionSetOverlayContent, true);

describe('Test displayFatalError function', () => {
    const dispatch: Dispatch = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
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
        actionSetOverlayContentMock.mockReturnValueOnce(returnSetOverlayContentAction);
        displayFatalError(dispatch);
        expect(actionSetOverlayContentMock).toHaveBeenCalledTimes(1);
        expect(actionSetOverlayContentMock).toHaveBeenCalledWith(overlayPayload);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(returnSetOverlayContentAction);
    });
});
