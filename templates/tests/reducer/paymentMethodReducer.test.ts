import {stateMock} from 'src/mocks';
import {paymentMethodReducer} from 'src/reducer';
import {UPDATE_PAYMENT_METHOD} from 'src/action';


describe('testing paymentMethodReducer Reducer', () => {

    const defaultValues = stateMock.data.initial_data.alternative_payment_methods;
    const updatedValues = {...defaultValues, value: 100};
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing UPDATE_PAYMENT_METHOD action ', action: {type: UPDATE_PAYMENT_METHOD, payload: {data: updatedValues}}, expectedValue: updatedValues },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = paymentMethodReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
