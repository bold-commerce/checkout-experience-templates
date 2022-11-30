import {stateMock} from 'src/mocks';
import {overlayReducer} from 'src/reducer';
import {SET_OVERLAY_CONTENT, SHOW_HIDE_OVERLAY} from 'src/action';
import {IOverlay} from 'src/types';

describe('testing overlayReducer Reducer', () => {

    const defaultValues = stateMock.overlay;

    test('should return the initial state ', () => {
        expect(overlayReducer(undefined, {type: ''})).toEqual(
            defaultValues
        );
    });

    test('testing SET_OVERLAY_CONTENT action ', () => {
        const overlay: IOverlay = {
            shown: true,
            inverted: true,
            content: 'test'
        };
        const state = overlayReducer(undefined ,
            {type: SET_OVERLAY_CONTENT,payload: {content: overlay}});
        expect(state).toEqual(overlay);
    });

    test('testing SHOW_HIDE_OVERLAY action ', () => {
        const overlay: IOverlay = {
            shown: true,
            inverted: true,
            content: 'test'
        };
        const state = overlayReducer(overlay ,
            {type: SHOW_HIDE_OVERLAY, payload: {shown: false}});
        expect(state.shown).toEqual(false);
    });

});
