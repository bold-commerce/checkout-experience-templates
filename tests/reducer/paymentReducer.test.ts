import {stateMock} from 'src/mocks';
import {paymentsReducer} from 'src/reducer';
import {ADD_PAYMENT, REMOVE_PAYMENT, UPDATE_PAYMENT} from 'src/action';


describe('testing paymentsReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.payments;
    const updatedValues = {...defaultValues, value: 100};
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing ADD_PAYMENT action ', action: {type: ADD_PAYMENT}, expectedValue: defaultValues },
        {name: 'testing REMOVE_PAYMENT action ', action: {type: REMOVE_PAYMENT, payload: {id: 'payment_id'}},  expectedValue: [] },
        {name: 'testing UPDATE_PAYMENT action', action: {type: UPDATE_PAYMENT, payload: {data: updatedValues}},  expectedValue: updatedValues },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = paymentsReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
