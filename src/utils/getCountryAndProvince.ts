import {
    getOrderInitialData,
    ICountryInformation,
    IProvince,
} from '@boldcommerce/checkout-frontend-library';
import {isSimilarStrings} from 'src/utils';

export function getCountryAndProvince(countryKey: string, provinceKey: string): {country?: ICountryInformation, province?: IProvince} {
    const {country_info: countryInfo} = getOrderInitialData();
    const country = countryInfo.find(info => isSimilarStrings(info.name, countryKey) || isSimilarStrings(info.iso_code, countryKey));
    const province = country?.provinces.find(info => isSimilarStrings(info.name, provinceKey) || isSimilarStrings(info.iso_code, provinceKey));
    return {country, province};
}
