import {Constants} from 'src/constants';
import {IAddressPostalCodeAndProvinceDataProps} from 'src/types';
import {useGetCountryInfoByCountryCode, useGetAddressDataField} from 'src/hooks';


export function useGetAddressPostalCodeAndProvinceData(type: string): IAddressPostalCodeAndProvinceDataProps{
    let countryCode = useGetAddressDataField(type, Constants.ADDRESS_COUNTRY_CODE);
    countryCode = (countryCode == '') ? 'CA' : countryCode;
    const countryInfo = useGetCountryInfoByCountryCode(countryCode);
    if(countryInfo){
        return {showProvince: countryInfo.show_province,
            showPostalCode: countryInfo.show_postal_code,
            provinceLabel: countryInfo.province_label,
            province: countryInfo.provinces};
    } else {
        return {province: [], provinceLabel:'', showProvince:false, showPostalCode:false };
    }
}
