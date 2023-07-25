import {stateMock} from 'src/mocks';
import {notesReducer} from 'src/reducer';
import {UPDATE_NOTES} from 'src/action';

describe('testing notesReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_meta_data.notes;
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues},
        {name: 'testing UPDATE_NOTES action', action: {type: UPDATE_NOTES,payload : {data: defaultValues}}, expectedValue: defaultValues},
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = notesReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });
});
