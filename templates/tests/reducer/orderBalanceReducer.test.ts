import {stateMock} from 'src/mocks';
import {orderBalanceReducer} from 'src/reducer';
import {UPDATE_ORDER_BALANCE} from 'src/action';


describe('testing orderBalanceReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_balance;

    test('should return the initial state ', () => {
        expect(orderBalanceReducer(undefined, {type: ''})).toEqual(
            defaultValues
        );
    });

    test('testing UPDATE_ORDER_BALANCE action ', () => {
        const balance = 500;

        const state = orderBalanceReducer(undefined ,
            {type: UPDATE_ORDER_BALANCE,payload : {data: balance}});

        expect(state).toEqual(balance);
    });

});
