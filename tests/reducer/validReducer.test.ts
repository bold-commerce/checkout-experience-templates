import {stateMock} from 'src/mocks';
import {validReducer} from 'src/reducer';
import {SET_VALID} from 'src/action';

describe('testing validReducer Reducer', () => {

    const defaultValues = stateMock.isValid;
    const updatedValues = {...defaultValues, shippingAddress:true};
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing SET_VALID action', action: {type: SET_VALID,payload : {field: 'shippingAddress' , value: true}}, expectedValue: updatedValues },
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = validReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
