import {stateMock} from 'src/mocks';
import {selectShippingLineReducer} from 'src/reducer';
import {SET_SELECTED_SHIPPING_LINE, UPDATE_SELECTED_SHIPPING_LINE} from 'src/action';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';


describe('testing selectShippingLineReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.shipping.selected_shipping;
    const shippingLine: IShippingLine= {
        id: '2',
        description: 'Test carrier',
        amount: 19.99
    };

    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing SET_SELECTED_SHIPPING_LINE action ', action: {type: SET_SELECTED_SHIPPING_LINE,payload : {line: shippingLine}}, expectedValue: shippingLine },
        {name: 'testing UPDATE_SELECTED_SHIPPING_LINE action', action: {type: UPDATE_SELECTED_SHIPPING_LINE,payload : {data: shippingLine}},  expectedValue: shippingLine },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = selectShippingLineReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
