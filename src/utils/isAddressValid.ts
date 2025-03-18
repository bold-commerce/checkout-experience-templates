import {validateAddress} from '@boldcommerce/checkout-frontend-library';
import {getCountryAndProvince, getPhoneNumber} from 'src/utils';
import {API_RETRY} from 'src/constants';

export async function isAddressValid(firstName:string, lastName: string, addressLine1: string, addressLine2:string, city:string, postalCode: string, countryKey: string, provinceKey: string,  phoneNumber: string, type: 'shipping' | 'billing'): Promise<boolean> {
    const {country, province} = getCountryAndProvince(countryKey, provinceKey);

    if(!country
        || (type === 'shipping' && !country.valid_for_shipping)
        || (type === 'billing' && !country.valid_for_billing)) {
        return false;
    }

    if (country.show_province) {
        if (!province
            || (type === 'shipping' && !province.valid_for_shipping)
            || (type === 'billing' && !province.valid_for_billing)) {
            return false;
        }
    }

    const validateRes = await validateAddress(
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        province?.name || '',
        province?.iso_code || '',
        country.name,
        country.iso_code,
        '',
        getPhoneNumber(phoneNumber),
        API_RETRY);

    return validateRes.success;
}
