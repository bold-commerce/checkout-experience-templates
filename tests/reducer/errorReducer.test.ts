import {errorsReducer} from 'src/reducer';
import {IError} from 'src/types';
import {ADD_ERROR, CLEAR_ERRORS, REMOVE_ERROR, REMOVE_ERROR_BY_ADDRESS_TYPE, REMOVE_ERROR_BY_FIELD, REMOVE_ERROR_BY_TYPE, REMOVE_ERROR_BY_TYPE_AND_CODE} from 'src/action';
import {Constants, errorFields, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';


describe('testing errorsReducer Reducer', () => {

    const error: IError = {
        type: errorTypes.validation,
        field: errorFields.email_address,
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.email_address,
        message: '',
        address_type: Constants.SHIPPING,
        code: ''
    };
    const defaultState: Array<IError> = [error];

    const dataSet = [
        {name: 'testing ADD_ERROR action', state: undefined, action: ADD_ERROR, payload: error, expected: defaultState},
        {name: 'testing ADD_ERROR action with same error', state: defaultState, action: ADD_ERROR, payload: error, expected: defaultState},
        {name: 'testing REMOVE_ERROR action', state: defaultState, action: REMOVE_ERROR, payload: error, expected: []},
        {name: 'testing REMOVE_ERROR_BY_FIELD action', state: defaultState, action: REMOVE_ERROR_BY_FIELD, payload: {field: error.field, addressType: error.address_type}, expected: []},
        {name: 'testing REMOVE_ERROR_BY_TYPE action', state: defaultState, action: REMOVE_ERROR_BY_TYPE, payload: {type: error.type, addressType: error.address_type}, expected: []},
        {name: 'testing REMOVE_ERROR_BY_TYPE_AND_CODE action', state: defaultState, action: REMOVE_ERROR_BY_TYPE_AND_CODE, payload: {type: error.type, code: error.code, addressType: error.address_type}, expected: []},
        {name: 'testing REMOVE_ERROR_BY_ADDRESS_TYPE action', state: defaultState, action: REMOVE_ERROR_BY_ADDRESS_TYPE, payload: {addressType: error.address_type}, expected: []},
        {name: 'testing REMOVE_ERROR_BY_ADDRESS_TYPE action with different type', state: defaultState, action: REMOVE_ERROR_BY_ADDRESS_TYPE, payload: {addressType: Constants.BILLING}, expected: defaultState},
        {name: 'testing CLEAR_ERRORS action with different type', state: defaultState, action: CLEAR_ERRORS, payload: '', expected: []},
    ];

    test('should return the initial state ', () => {
        expect(errorsReducer(defaultState, {type: ''})).toEqual(
            defaultState
        );
    });

    test.each(dataSet)('$name', ({name, state, action, payload, expected}) => {
        const newState = errorsReducer(state,
            {type: action, payload: payload});

        expect(newState).toEqual(expected);

    });

});
