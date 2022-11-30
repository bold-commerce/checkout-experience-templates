import {stateMock} from 'src/mocks';
import {addressAutoCompleteReducer, checkoutProcessReducer} from 'src/reducer';


describe('testing checkoutProcessReducer Reducer', () => {

    const defaultValues = stateMock.data.initial_data.general_settings.checkout_process;
    const dataSet = [
        {name: 'should return the initial state', expectedValue: defaultValues },
    ];

    test.each(dataSet)('$name', ({name, expectedValue}) => {
        const state = checkoutProcessReducer(undefined);
        expect(state).toEqual(expectedValue);

    });

});


describe('testing addressAutoCompleteReducer Reducer', () => {

    const defaultValues = stateMock.data.initial_data.general_settings.address_autocomplete;
    const dataSet = [
        {name: 'should return the initial state', expectedValue: defaultValues },
    ];

    test.each(dataSet)('$name', ({name, expectedValue}) => {
        const state = addressAutoCompleteReducer(undefined);
        expect(state).toEqual(expectedValue);

    });

});
