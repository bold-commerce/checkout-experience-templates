import {Constants} from 'src/constants';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

export const googleAutocompleteRetrieveCountriesListLimitation = (getCountryInfoList: Array<ICountryInformation>): Array<string> => {
    const countryCodesList: Array<string> = [];

    if (getCountryInfoList && getCountryInfoList.length > 0 && getCountryInfoList.length <= Constants.MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE) {
        getCountryInfoList.map((country) => {
            countryCodesList.push(country.iso_code);
        });
    }
    return countryCodesList;
};
