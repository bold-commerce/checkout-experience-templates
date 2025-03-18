import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getCountryName, getProvinceDetails} from 'src/utils';
import {IBraintreePaypalShippingAddress} from 'src/types';

export function formatBraintreePaypalPartialShippingAddress(address: IBraintreePaypalShippingAddress, phone = ''): IAddress {
    const countryIso = address.country_code ?? '';
    const region = address.state ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso as string, region as string);
    const countryName = getCountryName(countryIso as string);

    return {
        'first_name': '',
        'last_name': '',
        'address_line_1': '',
        'address_line_2': '',
        'country': countryName,
        'city': address.city as string,
        'province': provinceName,
        'country_code': countryIso as string,
        'province_code': provinceCode,
        'postal_code': address.postal_code as string,
        'business_name': '',
        'phone_number': phone
    };
}
