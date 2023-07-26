import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {IMetaPaymentAddress} from 'src/themes/flow-sdk/types';
import {getCountryName, getFirstAndLastName, getProvinceDetails} from '@boldcommerce/checkout-express-pay-library';

export function formatCheckoutAddressFromMeta(address: IMetaPaymentAddress | undefined, usePlaceHolderData = false): IAddress {
    const {addressLine, city, region: state, country, recipient, phone, organization, postalCode} = address ?? {};
    const {firstName, lastName} = getFirstAndLastName(recipient);
    const countryIso = country || '';
    const region = state || '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso, region);
    const countryName = getCountryName(countryIso);
    const address1 = Array.isArray(addressLine) && addressLine.length > 0 ? addressLine[0] : '';
    const address2 = Array.isArray(addressLine) && addressLine.length > 0 ? addressLine[1] : '';

    return {
        'first_name': firstName.trim() ? firstName : (usePlaceHolderData ? 'firstname' : ''),
        'last_name': lastName.trim() ? lastName : (usePlaceHolderData ? 'lastname' : ''),
        'address_line_1': address1.trim() ? address1 : (usePlaceHolderData ? 'addressLine1' : ''),
        'address_line_2': address2,
        'country': countryName,
        'city': city ?? '',
        'province':provinceName,
        'country_code': countryIso,
        'province_code': provinceCode,
        'postal_code': postalCode || '',
        'business_name': organization || '',
        'phone_number': phone?.trim() ? phone : (usePlaceHolderData ? '0000000000' : ''),
    };
}
