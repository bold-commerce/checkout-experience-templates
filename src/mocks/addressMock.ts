import {IAddress} from '@boldcommerce/checkout-frontend-library';

export const addressMock: IAddress = {
    first_name: 'First Name',
    last_name: 'Last Name',
    business_name: 'Company',
    address_line_1: 'Address',
    address_line_2: 'Apt,suite,etc. (optional)',
    city: 'City',
    country: 'Country',
    country_code: '',
    province_code: '',
    province: 'Province',
    postal_code: 'Postal Code',
    phone_number: 'Phone (optional)'
};

export const emptyAddressMock: IAddress = {
    first_name: '',
    last_name: '',
    business_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    country: '',
    country_code: '',
    province_code: '',
    province: '',
    postal_code: '',
    phone_number: ''
};
