import {stateMock} from 'src/mocks';
import {orderTotalReducer} from 'src/reducer';
import {UPDATE_ORDER_TOTAL} from 'src/action';


describe('testing orderTotalReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_total;

    test('should return the initial state ', () => {
        expect(orderTotalReducer(undefined, {type: ''})).toEqual(
            defaultValues
        );
    });

    test('testing UPDATE_ORDER_TOTAL action ', () => {
        const total = 500;

        const state = orderTotalReducer(undefined ,
            {type: UPDATE_ORDER_TOTAL,payload : {data: total}});

        expect(state).toEqual(total);
    });

});
