import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getCountryName, getPhoneNumber, getProvinceDetails} from 'src/utils';
import {IBraintreePaypalOnApproveAddress, IBraintreePaypalOnApproveCustomer} from 'src/types';

export function formatBraintreePaypalAddress(address: IBraintreePaypalOnApproveAddress, customer: IBraintreePaypalOnApproveCustomer, phoneNumberOverwrite = false): IAddress {
    const {state, countryCode, postalCode, city, line1, line2} = address ?? {};
    const countryIso = countryCode ?? '';
    const region = state ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso, region);
    const countryName = getCountryName(countryIso);

    return {
        'first_name': customer.first_name,
        'last_name': customer.last_name,
        'address_line_1': line1 ?? '',
        'address_line_2': line2 ?? '',
        'country': countryName,
        'city': city ?? '',
        'province':provinceName,
        'country_code': countryIso,
        'province_code': provinceCode,
        'postal_code': postalCode ?? '',
        'business_name': '',
        'phone_number': customer.phone || (phoneNumberOverwrite ? getPhoneNumber(customer.phone) : '')
    };
}
