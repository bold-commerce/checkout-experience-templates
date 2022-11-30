import {createdViaReducer, isProcessedReducer, resumableLinkReducer} from 'src/reducer';
import {UPDATE_ORDER_PROCESSED} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

describe('testing resumableLinkReducer Reducer', () => {

    test('should return the initial state ', () => {
        expect(resumableLinkReducer(undefined)).toEqual('');
    });

});

describe('testing createdViaReducer Reducer', () => {

    const defaultValues = defaultOrderInitialization.data.application_state.created_via;
    test('should return the initial state ', () => {
        expect(createdViaReducer(undefined)).toEqual(
            defaultValues
        );
    });

});

describe('testing isProcessedReducer Reducer', () => {

    const defaultValues = defaultOrderInitialization.data.application_state.is_processed;

    test('should return the initial state ', () => {
        expect(isProcessedReducer(undefined , {type: ''})).toEqual(
            defaultValues
        );
    });

    test('testing UPDATE_AVAILABLE_SHIPPING_LINES action ', () => {
        const updatedValues = true;
        const state = isProcessedReducer(undefined ,
            {type: UPDATE_ORDER_PROCESSED, payload: { data: updatedValues} });

        expect(state).toEqual(true);
    });
});
