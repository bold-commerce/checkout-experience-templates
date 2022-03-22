import {stateMock} from 'src/mocks';
import {countryReducer} from 'src/reducer';


describe('testing countryReducer Reducer', () => {

    const defaultValues = stateMock.data.initial_data.country_info;

    test('should return the initial state ', () => {
        expect(countryReducer(undefined, {type: ''})).toEqual(
            defaultValues
        );
    });

});
