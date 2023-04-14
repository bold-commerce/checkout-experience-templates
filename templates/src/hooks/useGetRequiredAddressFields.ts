import {
    useGetAddressPostalCodeAndProvinceData,
    useGetGeneralSettingCheckoutFields
} from 'src/hooks';


export function useGetRequiredAddressFields(type:string): string[] {
    const {showPostalCode, showProvince} = useGetAddressPostalCodeAndProvinceData(type);
    const showCompanyName = useGetGeneralSettingCheckoutFields('company_name_option'); 
    const showPhoneNumber = useGetGeneralSettingCheckoutFields('phone_number_required');
    const addressFields = [
        {
            field: 'first_name',
            required: true,
        },
        {
            field: 'last_name',
            required: true,
        },
        {
            field: 'address_line_1',
            required: true,
        },
        {
            field: 'address_line_2',
            required: false,
        },
        {
            field: 'country',
            required: true,
        },
        {
            field: 'city',
            required: true,
        },
        {
            field: 'province',
            required: showProvince as boolean,
        },
        {
            field: 'country_code',
            required: true,
        },
        {
            field: 'province_code',
            required: showProvince as boolean,
        },
        {
            field: 'postal_code',
            required: showPostalCode as boolean,
        },
        {
            field: 'business_name',
            required: showCompanyName === 'required' ? true : false as boolean,
        },
        {
            field: 'phone_number',
            required: showPhoneNumber as boolean,
        }
    ];
    return addressFields.filter(value => value.required).map(value => value.field);
}