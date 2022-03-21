import {stateMock} from 'src/mocks';
import {lineItemsReducer} from 'src/reducer';
import {UPDATE_LINE_ITEMS} from 'src/action';


describe('testing lineItemsReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.line_items;

    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing UPDATE_LINE_ITEMS action', action: {type: UPDATE_LINE_ITEMS,payload : {line: defaultValues}}, expectedValue: defaultValues },
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = lineItemsReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
