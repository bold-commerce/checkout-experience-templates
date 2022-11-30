import {sessionInitializedReducer} from 'src/reducer';
import {SET_SESSION_INITIALIZED} from 'src/action';

describe('testing sessionInitialized Reducer', () => {

    const defaultState = false;

    test('should return the initial state ', () => {
        expect(sessionInitializedReducer(undefined, {type: ''})).toEqual(
            defaultState
        );
    });

    test('testing SET_SESSION_INITIALIZED action ', () => {
        const state = sessionInitializedReducer(undefined ,
            {type: SET_SESSION_INITIALIZED,payload : {data : true}});

        expect(state).toEqual(true);
    });

});
