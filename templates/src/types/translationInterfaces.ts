import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';

export interface IErrorTypes {
    api: string;
    authorization: string;
    validation: string;
    order: string;
    address: string;
    discount_code_validation: string;
    shipping_line: string
}

export interface IErrorFields {
    code: string;
    email_address: string;
    email: string;
    postal_code: string;
    country_code: string;
    province: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    address_line_1: string;
    city: string;
    discounts: string;
    discountsFlash: string;
    public_order_id: string;
    payment: string;
    customer: string;
    cart: string;
    tax: string;
    inventory: string;
    business_name;
    id: string;
}

export interface IErrorSeverities {
    validation: string;
    critical: string;
}

export interface IErrorSubTypes {
    email_address: string;
    email: string;
    empty: string;
    discounts: string;
    public_order_id: string;
    payment: string;
    customer: string;
    cart: string;
    tax: string;
    insufficient_stock: string;
    no_shipping_to_address: string;
}

export interface IErrorShowType {
    field: string;
    flash: string;
    discountFlash: string;
    none: string;
}

export interface IErrorTerm {
    type: string;
    field: string;
    severity: string;
    subType: string;
    showType: string;
    section: string;
    term: string;
}

export interface IError extends IApiErrorResponse{
    code?: string;
    address_type?: string
}
