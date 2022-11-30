import {stateMock} from 'src/mocks';
import {shippingLineItemDiscountReducer, shippingLineItemTaxesReducer} from 'src/reducer';
import {UPDATE_SHIPPING_LINES_DISCOUNT, UPDATE_SHIPPING_LINES_TAXES} from 'src/action';


describe('testing shippingLineItemTaxesReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.shipping.taxes;
    const taxes = [{...defaultValues, value: 'test'}];
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing UPDATE_SHIPPING_LINES_TAXES action', action: {type: UPDATE_SHIPPING_LINES_TAXES,payload : {data: taxes}}, expectedValue: taxes },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = shippingLineItemTaxesReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});

describe('testing shippingLineItemDiscountReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.shipping.discounts;
    const discount = [{...defaultValues, code: 'test'}];
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing UPDATE_SHIPPING_LINES_DISCOUNT action', action: {type: UPDATE_SHIPPING_LINES_DISCOUNT,payload : {data: discount}}, expectedValue: discount },
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = shippingLineItemDiscountReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
