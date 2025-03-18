import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getCountryName, getProvinceDetails, getPhoneNumber, getFirstAndLastName} from 'src/utils';
import Address = google.payments.api.Address;

export function formatShippingAddressGoogle(address: Address | undefined, phoneNumberOverwrite = false): IAddress {
    const {administrativeArea, countryCode, postalCode, locality, name, address1, address2, phoneNumber} = address ?? {};
    const {firstName, lastName} = getFirstAndLastName(name);
    const countryIso = countryCode ?? '';
    const region = administrativeArea ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso, region);
    const countryName = getCountryName(countryIso);

    return {
        'first_name': firstName,
        'last_name': lastName,
        'address_line_1': address1 ?? '',
        'address_line_2': address2 ?? '',
        'country': countryName,
        'city': locality ?? '',
        'province':provinceName,
        'country_code': countryIso,
        'province_code': provinceCode,
        'postal_code': postalCode ?? '',
        'business_name': '',
        'phone_number': phoneNumber || (phoneNumberOverwrite ? getPhoneNumber(phoneNumber) : '')
    };
}
