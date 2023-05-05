import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {Constants} from 'src/constants';
import {countriesListMock} from 'src/mocks';
import {googleAutocompleteRetrieveOptions, googleAutocompleteRetrieveCountriesListLimitation} from 'src/utils';
import AutocompleteOptions = google.maps.places.AutocompleteOptions;

jest.mock('src/utils/googleAutocompleteRetrieveCountriesListLimitation');
const googleAutocompleteRetrieveCountriesListLimitationMock = mocked(googleAutocompleteRetrieveCountriesListLimitation, true);

describe('Test googleAutocompleteRetrieveOptions function', () => {
    const countriesList: Array<ICountryInformation> = countriesListMock;
    let expectedAutocompleteOptions: AutocompleteOptions;
    let expectedCountriesCodeList: Array<string>;

    beforeEach(() => {
        jest.resetAllMocks();
        expectedAutocompleteOptions = {
            fields: ['address_components'],
            types: ['address'],
        };
        expectedCountriesCodeList = ['CA','US','FR','BR','MX'];
    });

    test('No countries restriction', () => {
        googleAutocompleteRetrieveCountriesListLimitationMock.mockReturnValueOnce([]);

        const returned = googleAutocompleteRetrieveOptions([]);

        expect(returned).toStrictEqual(expectedAutocompleteOptions);
        expect(googleAutocompleteRetrieveCountriesListLimitationMock).toHaveBeenCalledTimes(1);
    });

    test(`More than ${Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE} restriction`, () => {
        googleAutocompleteRetrieveCountriesListLimitationMock.mockReturnValueOnce([]);

        const returned = googleAutocompleteRetrieveOptions(countriesList);

        expect(returned).toStrictEqual(expectedAutocompleteOptions);
        expect(googleAutocompleteRetrieveCountriesListLimitationMock).toHaveBeenCalledTimes(1);
    });

    test(`More than 1 and less than ${Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE} countries restrictions`, () => {
        const expectedSlice = expectedCountriesCodeList.slice(0, Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE) as string[];
        expectedAutocompleteOptions.componentRestrictions = {country: expectedSlice};
        googleAutocompleteRetrieveCountriesListLimitationMock.mockReturnValueOnce(expectedSlice);

        const returned = googleAutocompleteRetrieveOptions(countriesList.slice(0, Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE));

        expect(returned).toStrictEqual(expectedAutocompleteOptions);
        expect(googleAutocompleteRetrieveCountriesListLimitationMock).toHaveBeenCalledTimes(1);
    });
});
