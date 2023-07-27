import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {IMetaPaymentAddress} from 'src/themes/flow-sdk/types';

export const formatMetaAddressFromCheckout = (address: IAddress): IMetaPaymentAddress => {
    return {
        addressLine:[address.address_line_1, address.address_line_2],
        city: address.city,
        region: address.province_code,
        country: address.country_code,
        recipient: `${address.first_name} ${address.last_name}`.trim(),
        phone: address.phone_number,
        organization: address.business_name,
        postalCode: address.postal_code,
    };
};