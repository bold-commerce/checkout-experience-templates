import {shippingAddressFieldIds, loqateFields} from 'src/constants';
import {loqateEnumFieldMode, ILoqateAddressField} from 'src/types';

export class LoqateConstants {
    static JS_SCRIPT_ID = 'loqate-js-script-loader';
    static CSS_SCRIPT_ID = 'loqate-css-script-loader';
    static JS_SCRIPT_SRC = 'https://services.postcodeanywhere.co.uk/js/address-3.91.js';
    static CSS_SCRIPT_SRC = 'https://services.postcodeanywhere.co.uk/css/address-3.91.css';
    static API_KEY = 'RZ86-KX47-PP79-YJ72';

    static ADDRESS_FIELDS: Array<ILoqateAddressField> = [
        {
            element: shippingAddressFieldIds.companyFieldSelector,
            field: loqateFields.company,
            mode: loqateEnumFieldMode.POPULATE
        },
        {
            element: shippingAddressFieldIds.address1FieldSelector,
            field: loqateFields.address1,
            mode: loqateEnumFieldMode.POPULATE | loqateEnumFieldMode.SEARCH
        },
        {
            element: shippingAddressFieldIds.address2FieldSelector,
            field: loqateFields.address2,
            mode: loqateEnumFieldMode.POPULATE
        },
        {
            element: shippingAddressFieldIds.cityFieldSelector,
            field: loqateFields.city,
            mode: loqateEnumFieldMode.POPULATE
        },
        {
            element: shippingAddressFieldIds.provinceFieldSelector,
            field: loqateFields.provinceCode,
            mode: loqateEnumFieldMode.POPULATE
        },
        {
            element: shippingAddressFieldIds.postalCodeFieldSelector,
            field: loqateFields.postalCode,
            mode: loqateEnumFieldMode.POPULATE
        },
        {
            element: shippingAddressFieldIds.countryFieldSelector,
            field: loqateFields.countryCode,
            mode: loqateEnumFieldMode.POPULATE
        }
    ];
}
