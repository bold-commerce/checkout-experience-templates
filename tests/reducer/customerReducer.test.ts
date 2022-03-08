import {stateMock} from 'src/mocks';
import {customerReducer} from 'src/reducer';
import {
    UPDATE_CUSTOMER_FIELD,
    UPDATE_CUSTOMER_EMAIL,
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_ACCEPT_MARKETING
} from 'src/action';


describe('testing customerReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.customer;
    const updatedValue = {...defaultValues, first_name: 'Mark'};
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedField: 'first_name', expectedValue: defaultValues.first_name },
        {name: 'testing UPDATE_CUSTOMER_EMAIL action', action: {type: UPDATE_CUSTOMER_EMAIL, payload: { email: 'test@gmail.com'}}, expectedField: 'email_address', expectedValue: 'test@gmail.com' },
        {name: 'testing UPDATE_CUSTOMER_FIELD action', action: {type: UPDATE_CUSTOMER_FIELD, payload: { field: 'email_address', value: 'test@gmail.com'}}, expectedField: 'email_address', expectedValue: 'test@gmail.com' },
        {name: 'testing UPDATE_CUSTOMER action', action: {type: UPDATE_CUSTOMER, payload: { customer: updatedValue}}, expectedField: 'first_name', expectedValue: 'Mark' },
        {name: 'testing UPDATE_CUSTOMER_ACCEPT_MARKETING action ', action: {type: UPDATE_CUSTOMER_ACCEPT_MARKETING, payload: {value: true}}, expectedField: 'accepts_marketing', expectedValue: true }
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue, expectedField}) => {
        const newState = customerReducer(undefined, action);
        expect(newState[expectedField]).toEqual(expectedValue);

    });

});
