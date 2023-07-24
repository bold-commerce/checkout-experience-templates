import {stateMock} from 'src/mocks';
import {tagsReducer} from 'src/reducer';
import {UPDATE_TAGS} from 'src/action';

describe('testing tagsReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_meta_data.tags;
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues},
        {name: 'testing UPDATE_TAGS action', action: {type: UPDATE_TAGS,payload : {data: defaultValues}}, expectedValue: defaultValues},
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = tagsReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });
});
