import {stateMock} from 'src/mocks';
import {taxesReducer} from 'src/reducer';
import {UPDATE_TAXES} from 'src/action';

describe('testing taxesReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.taxes;
    const taxes = [{...defaultValues, name: 'test' }];
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing UPDATE_TAXES action', action: {type: UPDATE_TAXES,payload : {data: taxes}}, expectedValue: taxes },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = taxesReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
