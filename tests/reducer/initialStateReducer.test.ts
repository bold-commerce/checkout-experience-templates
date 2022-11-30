import {stateMock} from 'src/mocks';
import {languageReducer, shopNameReducer} from 'src/reducer';


describe('testing languageReducer Reducer', () => {

    const defaultValues = stateMock.data.initial_data.supported_languages;
    test('should return the initial state ', () => {
        expect(languageReducer(undefined)).toEqual(
            defaultValues
        );
    });

});

describe('testing shopNameReducer Reducer', () => {

    const defaultValues = stateMock.data.initial_data.shop_name;
    test('should return the initial state ', () => {
        expect(shopNameReducer(undefined)).toEqual(
            defaultValues
        );
    });

});
