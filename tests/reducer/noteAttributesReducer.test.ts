import {stateMock} from 'src/mocks';
import {noteAttributesReducer} from 'src/reducer';
import {UPDATE_NOTE_ATTRIBUTE_FIELD, UPDATE_NOTE_ATTRIBUTES} from 'src/action';

describe('testing noteAttributesReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_meta_data.note_attributes;
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues},
        {name: 'testing UPDATE_NOTE_ATTRIBUTES action', action: {type: UPDATE_NOTE_ATTRIBUTES,payload : {data: defaultValues}}, expectedValue: defaultValues},
        {name: 'testing UPDATE_NOTE_ATTRIBUTE_FIELD action', action: {type: UPDATE_NOTE_ATTRIBUTE_FIELD,payload : {field: 'test', value: 'test'}}, expectedValue: {'test': 'test'}},
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = noteAttributesReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });
});

