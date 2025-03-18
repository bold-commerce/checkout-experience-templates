import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getProvinceDetails, getFirstAndLastName, getCountryName} from 'src/utils';
import {IStripeAddress} from 'src/types';

export function formatStripeShippingAddress(address: IStripeAddress, phone = ''): IAddress {
    const countryIso = address.country ?? '';
    const region = address.region ?? '';
    const {code: provinceCode, name: provinceName} = getProvinceDetails(countryIso as string, region as string);
    const countryName = getCountryName(countryIso as string);
    const {firstName, lastName} = getFirstAndLastName(address.recipient as string);

    const formattedAddress: IAddress = {
        'first_name': firstName,
        'last_name': lastName,
        'address_line_1': (address.addressLine && address.addressLine[0])? address.addressLine[0] : '',
        'address_line_2':(address.addressLine && address.addressLine[1])? address.addressLine[1] : '',
        'country': countryName,
        'city': address.city as string,
        'province':provinceName,
        'country_code': countryIso  as string,
        'province_code': provinceCode,
        'postal_code': address.postalCode as string,
        'business_name': address.organization  as string,
        'phone_number': phone
    };

    if (formattedAddress.postal_code.length <= 4 && formattedAddress.country_code === 'CA') {
        formattedAddress.postal_code += '1A1'; //adding default postal code because stripe only provide first 3 digits until the payment is done.
    }

    return formattedAddress;

}
