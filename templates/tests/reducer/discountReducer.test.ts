import {discountsReducer} from 'src/reducer';
import {stateMock} from 'src/mocks';
import {ADD_DISCOUNT, REMOVE_DISCOUNT, UPDATE_DISCOUNTS} from 'src/action';
import {IDiscount} from '@boldcommerce/checkout-frontend-library';


describe('testing discountsReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.discounts;
    const newDiscount: IDiscount = {
        code: 'code',
        text: 'description',
        value: 5,
        valid: true
    };
    const combinedState = [
        ...defaultValues,
        newDiscount
    ];
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing ADD_DISCOUNT action ', action: {type: ADD_DISCOUNT, payload:  newDiscount}, expectedValue: combinedState },
        {name: 'testing ADD_DISCOUNT action with same code', action: {type: ADD_DISCOUNT, payload:  defaultValues[0]},  expectedValue: defaultValues },
        {name: 'testing REMOVE_DISCOUNT action ', action: {type: REMOVE_DISCOUNT,payload : {code: 'Test Discount Code'}},  expectedValue: [] },
        {name: 'testing UPDATE_DISCOUNTS action', action: {type: UPDATE_DISCOUNTS, payload: { data: newDiscount}}, expectedValue: newDiscount },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = discountsReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
