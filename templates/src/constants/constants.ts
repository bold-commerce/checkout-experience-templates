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
    static readonly SHIPPING_TOGGLE = 'SHIPPING_TOGGLE';
    static readonly TAXES_TOGGLE = 'TAXES_TOGGLE';
    static readonly DISCOUNTS_TOGGLE = 'DISCOUNTS_TOGGLE';
    static readonly FEES_TOGGLE = 'FEES_TOGGLE';
    static readonly PAYMENTS_TOGGLE = 'PAYMENTS_TOGGLE';
    static readonly SUBTOTAL_EVENT = 'SUBTOTAL_EVENT';
    static readonly TOTAL_EVENT = 'TOTAL_EVENT';
    static readonly AMOUNT_DUE_EVENT = 'AMOUNT_DUE_EVENT';
    static readonly CUSTOM = 'custom';
    static readonly CUSTOMER_INFO = 'customer_information';
    static readonly SHIPPING_INFO = 'shipping_address';
    static readonly SHIPPING_METHOD_INFO = 'shipping_method';
    static readonly PAYMENT_INFO = 'payment_method';
    static readonly SUMMARY_INFO = 'summary';
    static readonly SAVED_PAYMENT_INFO = 'saved_payment_methods';
    static readonly SHIPPING = 'shipping';
    static readonly BILLING = 'billing';
    static readonly SHIPPING_SAME = 'same';
    static readonly SHIPPING_DIFFERENT = 'custom';
    static readonly ADDRESS_FIRST_NAME = 'first_name';
    static readonly ADDRESS_LAST_NAME = 'last_name';
    static readonly ADDRESS_BUSINESS = 'business_name';
    static readonly ADDRESS_BUSINESS_OPTIONAL = 'business_name_optional';
    static readonly ADDRESS_ADDRESS_1 = 'address_line_1';
    static readonly ADDRESS_ADDRESS_2 = 'address_line_2';
    static readonly ADDRESS_CITY = 'city';
    static readonly ADDRESS_COUNTRY = 'country';
    static readonly ADDRESS_COUNTRY_CODE = 'country_code';
    static readonly ADDRESS_PROVINCE = 'province';
    static readonly ADDRESS_PROVINCE_CODE = 'province_code';
    static readonly ADDRESS_POSTAL_CODE = 'postal_code';
    static readonly ADDRESS_PHONE = 'phone_number';
    static readonly ADDRESS_PHONE_OPTIONAL = 'phone_number_optional';
    static readonly CONFIRMATION_PAGE_INFO = 'confirmation_page';
    static readonly GLOBAL_INFO = 'global';
    static readonly GENERIC_ERROR_INFO = 'generic';
    static readonly PIGI_IFRAME = 'iframe-payment-gateway';
    static readonly MAX_COUNTRIES_GOOGLE_AUTOCOMPLETE = 5;
    static readonly LANGUAGE_BLOB_TYPE = 'LANGUAGE_BLOB_TYPE';
    static readonly LANGUAGE_BLOB_ERROR_TYPE = 'LANGUAGE_BLOB_ERROR_TYPE';
    static readonly OUT_OF_STOCK_INFO = 'out_of_stock';
    static readonly OUT_OF_STOCK_FAIL = 'fail';
    static readonly EXPERIENCE_ROUTE = 'experience';
    static readonly RESUME_ROUTE = 'resume';
    static readonly SHIPPING_ROUTE = 'shipping_lines';
    static readonly PAYMENT_ROUTE = 'payment';
    static readonly OUT_OF_STOCK_ROUTE = 'out_of_stock';
    static readonly THANK_YOU_ROUTE = 'thank_you';
    static readonly SESSION_EXPIRED_ROUTE = 'session_expired';
    static readonly BUY_NOW_ROUTE = 'buy_now';
    static readonly DEFAULT_TITLE = 'default title';
    static readonly ARIA_LIVE_POLITE = 'polite';
    static readonly ARIA_LIVE_ASSERTIVE = 'assertive';
    static readonly OTHER_PAYMENT_TYPE = 'OTHER_PAYMENT_TYPE';
    static readonly PAYMENT_METHOD_BELOW = 'payment_method_below';
    static readonly CUSTOMER_INFO_BELOW = 'customer_info_below';
    static readonly CUSTOMER_INFO_ABOVE = 'customer_info_above';
}

export const errorTypes: IErrorTypes = {
    api: 'api',
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
    discountsFlash: 'discountsFlash',
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
    insufficient_stock: 'insufficient_stock',
    no_shipping_to_address: 'no_shipping_to_address',
};

export const errorShowType: IErrorShowType = {
    field: 'field',
    flash: 'flash',
    discountFlash: 'discountFlash',
    none: 'none',
};

export class BreadcrumbsStatus {
    static COMPLETED = 'completed';
    static ACTIVE = 'active';
    static NEXT = 'next';
    static UPCOMING = 'upcoming';
}

export class autocompleteServices {
    static GOOGLE_AUTOCOMPLETE = 'google';
    static LOQATE = 'loqate';

}

export class debounceConstants {
    static debouncedGuestCustomerFunction: () => void;
    static DEFAULT_DEBOUNCE_TIME = 3000;
    static DEBOUNCE_UI_UPDATE_TIME = 300;
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

export const API_RETRY = 1;
export const HIDE_MESSAGE = 5000;

export class PlatformTypeConstants {
    static BIG_COMMERCE = 'bigcommerce';
    static BOLD_PLATFORM = 'bold_platform';
    static COMMERCE_TOOLS = 'commercetools';
    static GENERAL = 'general';
    static SHOPIFY = 'shopify';
    static WOO_COMMERCE = 'woocommerce';
}

export const MOBILE_SCREEN_WIDTH = 768;
export const TABLET_SCREEN_WIDTH = 1200;

export const PLUGIN_BACKEND_DISCOUNT_SOURCE = 'cart';
