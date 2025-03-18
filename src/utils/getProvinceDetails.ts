import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';


export function getProvinceDetails(countryIso: string, province: string): {code: string, name: string} {
    const {country_info} = getOrderInitialData();
    const countryInfo = country_info.find(o => o.iso_code === countryIso);
    if(countryInfo) {
        const region = countryInfo.provinces.find(o => (o.name === province || o.iso_code === province));
        if(region) {
            return {code: region.iso_code, name: region.name};
        }
    }
    return {code: '', name: ''};
}
