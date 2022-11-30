import {stateMock} from 'src/mocks';
import {currencyReducer} from 'src/reducer';

describe('testing currency Reducer', () => {

    const defaultValues = stateMock.data.application_state.currency;
    test('should return the initial state ', () => {
        expect(currencyReducer(undefined)).toEqual(
            defaultValues
        );
    });
});
