import {googleAutocompleteRetrieveCountriesListLimitation} from 'src/utils';
import {Constants} from 'src/constants';
import {countriesListMock} from 'src/mocks';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

describe('Test googleAutocompleteRetrieveCountriesListLimitation function', () => {
    const countriesList: Array<ICountryInformation> = countriesListMock;
    let expectedCountriesCodeList: Array<string>;
    beforeEach(() => {
        jest.restoreAllMocks();
        expectedCountriesCodeList = ['CA','US','FR','BR','MX'];

    });

    test('No country provided', () => {
        const returned = googleAutocompleteRetrieveCountriesListLimitation([]);
        expect(returned).toStrictEqual([]);
    });
    test(`More than ${Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE} countries provided`, () => {
        const returned = googleAutocompleteRetrieveCountriesListLimitation(countriesList);
        expect(returned).toStrictEqual([]);
    });
    test('1 country provided', () => {
        const returned = googleAutocompleteRetrieveCountriesListLimitation(countriesList.slice(0, 1));
        expect(returned).toStrictEqual(expectedCountriesCodeList.slice(0, 1));
    });
    test(`${Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE} countries provided`, () => {
        const returned = googleAutocompleteRetrieveCountriesListLimitation(countriesList.slice(0, Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE));
        expect(returned).toStrictEqual(expectedCountriesCodeList);
    });
});
