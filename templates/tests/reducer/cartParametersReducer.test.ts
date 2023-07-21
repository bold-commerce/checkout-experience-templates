import {stateMock} from 'src/mocks';
import {cartParametersReducer} from 'src/reducer';
import {UPDATE_CART_PARAMETERS} from 'src/action';

describe('testing cartParametersReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_meta_data.cart_parameters;
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues},
        {name: 'testing UPDATE_CART_PARAMETERS action', action: {type: UPDATE_CART_PARAMETERS,payload : {data: defaultValues}}, expectedValue: defaultValues},
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = cartParametersReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });
});
