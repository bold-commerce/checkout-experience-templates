import {buttonDisableReducer} from 'src/reducer';
import {stateMock} from 'src/mocks';
import {SET_BUTTON_DISABLE} from 'src/action';

describe('testing button disable Reducer', () => {

    const defaultValues = stateMock.isButtonDisable;
    test('should return the initial state ', () => {
        expect(buttonDisableReducer(undefined , {type: ''})).toEqual(defaultValues);
    });

    test('testing SET_BUTTON_DISABLE action ', () => {
        const value = false;
        const state = buttonDisableReducer(undefined ,
            {type: SET_BUTTON_DISABLE, payload: { field: 'customerPageButton' , value: value} });

        expect(state.customerPageButton).toEqual(value);
    });

});
