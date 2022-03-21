import {IAutocompleteData} from 'src/types';

export function isAutocompleteDataPopulated(addressData: IAutocompleteData ): boolean {
    return addressData &&
        addressData.address1 !== '' &&
        addressData.city !== '' &&
        addressData.province !== '' &&
        addressData.provinceCode !== '' &&
        addressData.country !== '' &&
        addressData.countryCode !== '' &&
        addressData.postalCode !== '';
}
