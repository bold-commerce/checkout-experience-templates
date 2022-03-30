import {
    IErrorFields,
    IErrorSeverities,
    IErrorShowType,
    IErrorSubTypes,
    IErrorTypes,
    IPigiHandleScaSteps,
    IPigiPaymentTypes
} from 'src/types';

export class Constants {
    static SHIPPING_TOGGLE = 'SHIPPING_TOGGLE';
    static TAXES_TOGGLE = 'TAXES_TOGGLE';
    static DISCOUNTS_TOGGLE = 'DISCOUNTS_TOGGLE';
    static PAYMENTS_TOGGLE = 'PAYMENTS_TOGGLE';
    static SUBTOTAL_EVENT = 'SUBTOTAL_EVENT';
    static TOTAL_EVENT = 'TOTAL_EVENT';
    static AMOUNT_DUE_EVENT = 'AMOUNT_DUE_EVENT';
    static CUSTOMER_INFO = 'customer_information';
    static SHIPPING_INFO = 'shipping_address';
    static SHIPPING_METHOD_INFO = 'shipping_method';
    static PAYMENT_INFO = 'payment_method';
    static SUMMARY_INFO = 'summary';
    static SAVED_PAYMENT_INFO = 'saved_payment_methods';
    static SHIPPING = 'shipping';
    static BILLING = 'billing';
    static SHIPPING_SAME = 'same';
    static SHIPPING_DIFFERENT = 'custom';
    static ADDRESS_FIRST_NAME = 'first_name';
    static ADDRESS_LAST_NAME = 'last_name';
    static ADDRESS_BUSINESS = 'business_name';
    static ADDRESS_BUSINESS_OPTIONAL = 'business_name_optional';
    static ADDRESS_ADDRESS_1 = 'address_line_1';
    static ADDRESS_ADDRESS_2 = 'address_line_2';
    static ADDRESS_CITY = 'city';
    static ADDRESS_COUNTRY = 'country';
    static ADDRESS_COUNTRY_CODE = 'country_code';
    static ADDRESS_PROVINCE = 'province';
    static ADDRESS_PROVINCE_CODE = 'province_code';
    static ADDRESS_POSTAL_CODE = 'postal_code';
    static ADDRESS_PHONE = 'phone_number';
    static ADDRESS_PHONE_OPTIONAL = 'phone_number_optional';
    static CONFIRMATION_PAGE_INFO = 'confirmation_page';
    static GLOBAL_INFO = 'global';
    static GENERIC_ERROR_INFO = 'generic';
    static PIGI_IFRAME = 'iframe-payment-gateway';
    static MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE = 5;
    static LANGUAGE_BLOB_TYPE = 'LANGUAGE_BLOB_TYPE';
    static LANGUAGE_BLOB_ERROR_TYPE = 'LANGUAGE_BLOB_ERROR_TYPE';
    static OUT_OF_STOCK_INFO = 'out_of_stock';
}

export const errorTypes: IErrorTypes = {
    authorization: 'authorization',
    validation: 'validation',
    order: 'order',
    address: 'address',
    discount_code_validation: 'discount_code.discount_validation',
    shipping_line: 'shipping_line',
};

export const errorFields: IErrorFields = {
    code: 'code',
    email_address: 'email_address',
    email: 'email',
    postal_code: 'postal_code',
    country_code: 'country_code',
    province: 'province',
    phone_number: 'phone_number',
    address_line_1: 'address_line_1',
    first_name: 'first_name',
    last_name: 'last_name',
    city: 'city',
    discounts: 'discounts',
    public_order_id: 'public_order_id',
    payment: 'payment',
    customer: 'customer',
    tax: 'tax',
    cart: 'cart',
    inventory: 'inventory',
    business_name: 'business_name',
    id: 'id',
};

export const errorSeverities: IErrorSeverities = {
    validation: 'validation',
    critical: 'critical'
};

export const errorSubTypes: IErrorSubTypes = {
    email_address: 'email_address',
    email: 'email',
    empty: '',
    discounts: 'discounts',
    public_order_id: 'public_order_id',
    payment: 'payment',
    customer: 'customer',
    tax: 'tax',
    cart: 'cart',
    insufficient_stock: 'insufficient_stock'
};

export const errorShowType: IErrorShowType = {
    field: 'field',
    flash: 'flash',
    none: 'none',
};

export class BreadcrumbsStatus {
    static COMPLETED = 'completed';
    static ACTIVE = 'active';
    static NEXT = 'next';
    static UPCOMING = 'upcoming';
}

export class autocompleteServices {
    static GOOGLE_AUTOCOMPLETE = 'googleAutocomplete';
    static LOQATE = 'loqate';

}

export class debounceConstants {
    static debouncedGuestCustomerFunction: () => void;
    static DEFAULT_DEBOUNCE_TIME = 3000;
}

export const pigiHandleScaSteps: IPigiHandleScaSteps = {
    DISPLAYED: 'DISPLAYED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

export const pigiPaymentTypes: IPigiPaymentTypes = {
    GIFT_CARD: 'GIFT_CARD',
    PAYPAL: 'paypal',
};

export const counterNames: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    twelve: 12
};
