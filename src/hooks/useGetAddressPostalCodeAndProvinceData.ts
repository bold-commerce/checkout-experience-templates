import {Constants} from 'src/constants';
import {IAddressPostalCodeAndProvinceDataProps} from 'src/types';
import {useGetCountryInfoByCountryCode, useGetAddressDataField, useGetCountryInfoList} from 'src/hooks';

export function useGetAddressPostalCodeAndProvinceData(type: string): IAddressPostalCodeAndProvinceDataProps{
    let countryCode = useGetAddressDataField(type, Constants.ADDRESS_COUNTRY_CODE);
    const countriesList = useGetCountryInfoList();
    if (countryCode === '' && countriesList && countriesList.length === 1) {
        countryCode = countriesList[0].iso_code;
    }
    const countryInfo = useGetCountryInfoByCountryCode(countryCode);
    if (countryInfo) {
        const compareFn = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        countryInfo.provinces.sort(compareFn);
        return {showProvince: countryInfo.show_province,
            showPostalCode: countryInfo.show_postal_code,
            provinceLabel: countryInfo.province_label,
            province: countryInfo.provinces};
    } else {
        return {province: [], provinceLabel:'', showProvince:false, showPostalCode:false};
    }
}
