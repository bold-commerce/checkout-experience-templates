import {availableShippingLinesReducer} from 'src/reducer';
import {stateMock} from 'src/mocks';
import {UPDATE_AVAILABLE_SHIPPING_LINES} from 'src/action';

describe('testing availableShippingLinesReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.shipping.available_shipping_lines;

    test('should return the initial state ', () => {
        expect(availableShippingLinesReducer(undefined , {type: ''})).toEqual(
            defaultValues
        );
    });

    test('testing UPDATE_AVAILABLE_SHIPPING_LINES action ', () => {
        const updatedValues = {...defaultValues};
        updatedValues[0].description = 'test';
        const state = availableShippingLinesReducer(undefined ,
            {type: UPDATE_AVAILABLE_SHIPPING_LINES, payload: { data: updatedValues} });

        expect(state[0].description).toEqual('test');
    });
});
