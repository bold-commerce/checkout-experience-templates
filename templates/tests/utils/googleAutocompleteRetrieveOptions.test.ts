import {ICountryInformation} from 'src/types';
import {googleAutocompleteRetrieveOptions} from 'src/utils';
import AutocompleteOptions = google.maps.places.AutocompleteOptions;
import SpyInstance = jest.SpyInstance;
import * as googleAutocompleteRetrieveCountriesListLimitation from 'src/utils/googleAutocompleteRetrieveCountriesListLimitation';
import {Constants} from 'src/constants';
import {countriesListMock} from 'src/mocks';

const calledOnce = 1;

describe('Test googleAutocompleteRetrieveOptions function', () => {
    const countriesList: Array<ICountryInformation> = countriesListMock;
    let expectedAutocompleteOptions: AutocompleteOptions;
    let googleAutocompleteRetrieveCountriesListLimitationSpy: SpyInstance;
    let expectedCountriesCodeList: Array<string>;


    beforeEach(() => {
        jest.restoreAllMocks();
        expectedAutocompleteOptions = {
            fields: ['address_components'],
            types: ['address'],
        };
        googleAutocompleteRetrieveCountriesListLimitationSpy = jest.spyOn(
            googleAutocompleteRetrieveCountriesListLimitation,
            'googleAutocompleteRetrieveCountriesListLimitation'
        );
        expectedCountriesCodeList = ['CA','US','FR','BR','MX'];
    });

    test('No countries restriction', () => {
        const returned = googleAutocompleteRetrieveOptions([]);
        googleAutocompleteRetrieveCountriesListLimitationSpy.mockReturnValue([]);
        expect(returned).toStrictEqual(expectedAutocompleteOptions);
        expect(googleAutocompleteRetrieveCountriesListLimitationSpy).toHaveBeenCalledTimes(calledOnce);
    });
    test(`More than ${Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE} restriction`, () => {
        const returned = googleAutocompleteRetrieveOptions(countriesList);
        googleAutocompleteRetrieveCountriesListLimitationSpy.mockReturnValue(expectedCountriesCodeList);
        expect(returned).toStrictEqual(expectedAutocompleteOptions);
        expect(googleAutocompleteRetrieveCountriesListLimitationSpy).toHaveBeenCalledTimes(calledOnce);
    });
    test(`More than 1 and less than ${Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE} countries restrictions`, () => {
        expectedAutocompleteOptions.componentRestrictions = {country: expectedCountriesCodeList.slice(0, Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE) as string[]};
        const returned = googleAutocompleteRetrieveOptions(countriesList.slice(0, Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE));
        googleAutocompleteRetrieveCountriesListLimitationSpy.mockReturnValue(expectedCountriesCodeList.slice(0, Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE));
        expect(returned).toStrictEqual(expectedAutocompleteOptions);
        expect(googleAutocompleteRetrieveCountriesListLimitationSpy).toHaveBeenCalledTimes(calledOnce);
    });
});
