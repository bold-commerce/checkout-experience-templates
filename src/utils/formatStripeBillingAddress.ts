import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getFirstAndLastName, getProvinceDetails, getCountryName} from 'src/utils';
import {IStripeCard} from 'src/types';

export function formatStripeBillingAddress(card: IStripeCard, payerName = '', payerPhone = '' ): IAddress {
    const {firstName, lastName} = getFirstAndLastName(payerName);
    const {code: provinceCode, name: provinceName} = getProvinceDetails(card.address_country, card.address_state);
    const countryName = getCountryName(card.address_country);

    const formattedAddress = {
        'first_name': firstName,
        'last_name': lastName,
        'address_line_1': card.address_line1,
        'address_line_2': card.address_line2,
        'country': countryName,
        'city': card.address_city,
        'province': provinceName,
        'country_code': card.address_country,
        'province_code': provinceCode,
        'postal_code': card.address_zip,
        'business_name': '',
        'phone_number': payerPhone
    };

    if (formattedAddress.postal_code.length <= 4 && formattedAddress.country_code === 'CA') {
        formattedAddress.postal_code += '1A1'; //adding default postal code because stripe only provide first 3 digits until the payment is done.
    }

    return formattedAddress;
}
