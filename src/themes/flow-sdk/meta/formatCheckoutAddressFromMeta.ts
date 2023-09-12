import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {IMetaPaymentAddress} from 'src/themes/flow-sdk/types';
import {getCountryName, getFirstAndLastName, getProvinceDetails} from '@boldcommerce/checkout-express-pay-library';
import {MetaAddressPlaceholders} from 'src/themes/flow-sdk/constants';
import {placeHolderTransformer} from 'src/themes/flow-sdk/lib/placeholder';
import {getFirstAddressLine, getSecondAddressLine} from 'src/themes/flow-sdk/lib/address';

export const formatCheckoutAddressFromMeta = (address: IMetaPaymentAddress | undefined, usePlaceHolderData = false): IAddress => {
    return {
        first_name: placeHolderTransformer(
            getFirstAndLastName(address?.recipient).firstName.trim(),
            MetaAddressPlaceholders.first_name,
            usePlaceHolderData
        ),
        last_name: placeHolderTransformer(
            getFirstAndLastName(address?.recipient).lastName.trim(),
            MetaAddressPlaceholders.last_name,
            usePlaceHolderData),
        address_line_1: placeHolderTransformer(
            getFirstAddressLine(address),
            MetaAddressPlaceholders.address_line_1,
            usePlaceHolderData,
        ),
        address_line_2: getSecondAddressLine(address),
        country: getCountryName(address?.country || ''),
        city: address?.city || '',
        province: getProvinceDetails(address?.country || '', address?.region || '').name,
        country_code: address?.country || '',
        province_code: getProvinceDetails(address?.country || '', address?.region || '').code,
        postal_code: address?.postalCode || '',
        business_name: address?.organization || '',
        phone_number: placeHolderTransformer(address?.phone?.trim(), MetaAddressPlaceholders.phone_number, usePlaceHolderData),
    };
};
