import {feesReducer} from 'src/reducer';
import {stateMock} from 'src/mocks';
import {UPDATE_FEES} from 'src/action';
import {feesMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

describe('testing fees Reducer', () => {

    const dataSet = [
        {name: 'should return the initial state', action: {type: ''}, expectedValue: stateMock.data.application_state.fees },
        {name: 'testing UPDATE_FEES action', action: {type: UPDATE_FEES, payload: { data: feesMock}}, expectedValue: feesMock },
    ];

    test.each(dataSet)('$name', ({name, action, expectedValue}) => {
        const state = feesReducer(undefined, action);
        expect(state).toEqual(expectedValue);

    });

});
