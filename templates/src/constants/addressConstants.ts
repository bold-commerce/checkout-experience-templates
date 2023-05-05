import {IAddress, ICountryInformation} from '@boldcommerce/checkout-frontend-library';

export const defaultAddressState : IAddress = {
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    country: '',
    city: '',
    province: '',
    country_code: '',
    province_code: '',
    postal_code: '',
    business_name: '',
    phone_number: ''
};


export const defaultCountryInfo : ICountryInformation = {
    iso_code: '',
    name: '',
    show_province: true,
    province_label: '',
    show_postal_code: true,
    provinces: [],
    valid_for_shipping: true,
    valid_for_billing: false
};

export const AddressLabelMapping = {
    first_name: 'first_name_field',
    last_name: 'last_name_field',
    address_line_1: 'address_field',
    address_line_2: 'address2_field_optional',
    country: 'country_field',
    city: 'city_field',
    province: 'province_field',
    state: 'State',
    state_placeholder: 'state_field_placeholder',
    state_territory: 'state_territory_field',
    department_placeholder: 'department_field_placeholder',
    province_placeholder: 'province_field_placeholder',
    state_territory_placeholder: 'state_territory_field_placeholder',
    department: 'Department',
    postal_code: 'postal_code_field',
    business_name: 'company_field',
    business_name_optional: 'company_field_optional',
    phone_number_optional: 'phone_field_optional',
    phone_number: 'phone_field',
};

export const AddressFieldIds = {
    postalCodeFieldSelector: '#shipping-address__postal_code',
    cityFieldSelector: '#shipping-address__city',
    provinceFieldSelector: '#shipping-address__province',
    countryFieldSelector: '#shipping-address__country',
    address1FieldSelector: 'shipping-address__address_line_1',
    address2FieldSelector: 'shipping-address__address_line_2',
    companyFieldSelector: 'shipping-address__company',
};

export const loqateFields = {
    company: 'company',
    address1: 'address',
    address2: 'address2',
    city: 'city',
    provinceCode: 'province_code',
    countryCode: 'country_code',
    postalCode: 'postal_code,'
};
