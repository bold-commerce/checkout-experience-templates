import {stateMock} from 'src/mocks';
import {orderMetaReducer} from 'src/reducer';
import {UPDATE_ORDER_META_DATA} from 'src/action';


describe('testing orderMetaReducer Reducer', () => {

    const defaultValues = stateMock.data.application_state.order_meta_data;
    const updatedValues = {...defaultValues, notes:'tests'};
    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: defaultValues },
        {name: 'testing UPDATE_ORDER_META_DATA action', action: {type: UPDATE_ORDER_META_DATA,payload : {data: updatedValues}}, expectedValue: updatedValues },
    ];
    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = orderMetaReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
