import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getCountryName, getProvinceDetails, getPhoneNumber} from 'src/utils';
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

export function formatApplePayContactToCheckoutAddress(address: ApplePayPaymentContact, phoneNumberOverwrite = false): IAddress {
    const {givenName, familyName, phoneNumber, postalCode, locality, addressLines} = address;
    const countryIso = address.countryCode ?? '';
    const region = address.administrativeArea ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso, region);
    const countryName = getCountryName(countryIso);

    return {
        'first_name': givenName ?? '',
        'last_name': familyName ?? '',
        'address_line_1': (addressLines && addressLines[0])? addressLines[0] : '',
        'address_line_2':(addressLines && addressLines[1])? addressLines[1] : '',
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
