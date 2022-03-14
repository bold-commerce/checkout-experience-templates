import {
    actionSetOverlayContent, actionShowHideOverlayContent, SET_OVERLAY_CONTENT, SHOW_HIDE_OVERLAY
} from 'src/action';

import {defaultOrderInitialization} from 'src/constants/orderInitialization';

describe('Testing Overlay Actions', () => {

    test('actionSetOverlayContent', () => {
        const content = defaultOrderInitialization.overlay;
        const actionReturnExpectation = {
            type: SET_OVERLAY_CONTENT,
            payload: {content}
        };

        const result = actionSetOverlayContent(content);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionShowHideOverlayContent', () => {
        const shown = true;
        const actionReturnExpectation = {
            type: SHOW_HIDE_OVERLAY,
            payload: {shown}
        };

        const result = actionShowHideOverlayContent(shown);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

});
