import {ICountryInformation} from 'src/types';
import {googleAutocompleteRetrieveCountriesListLimitation} from 'src/utils';
import AutocompleteOptions = google.maps.places.AutocompleteOptions;

export const googleAutocompleteRetrieveOptions = (getCountryInfoList: Array<ICountryInformation>): AutocompleteOptions => {
    const countriesRestrictions = googleAutocompleteRetrieveCountriesListLimitation(getCountryInfoList);
    const options: AutocompleteOptions = {
        fields: ['address_components'],
        types: ['address'],
    };
    if (countriesRestrictions.length > 0) {
        options.componentRestrictions = {country: countriesRestrictions};
    }
    return options;
};
