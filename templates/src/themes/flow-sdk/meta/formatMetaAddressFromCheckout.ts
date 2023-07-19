import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {IMetaPaymentAddress} from 'src/themes/flow-sdk/types';

export function formatMetaAddressFromCheckout(address: IAddress): IMetaPaymentAddress {
    const {
        first_name: firstName,
        last_name: lastName,
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        country_code: country,
        province_code: region,
        postal_code: postalCode,
        business_name: organization,
        phone_number: phone,
        city
    } = address ?? {};

    return {
        addressLine:[addressLine1, addressLine2],
        city,
        region,
        country,
        recipient: `${firstName} ${lastName}`.trim(),
        phone,
        organization,
        postalCode
    };
}
