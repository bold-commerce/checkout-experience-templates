import {IErrorTerm} from 'src/types';
import {errorFields, errorSeverities, errorShowType, errorSubTypes, errorTypes} from 'src/constants';

export const errorsTerms: Array<IErrorTerm> = [
    {
        type: errorTypes.validation,
        field: errorFields.email_address,
        severity: errorSeverities.validation,
        subType: errorSubTypes.email_address,
        showType: errorShowType.field,
        section: 'core_info',
        term: 'enter_email'
    },
    {
        type: errorTypes.validation,
        field: errorFields.email,
        severity: errorSeverities.validation,
        subType: errorSubTypes.email,
        showType: errorShowType.field,
        section: 'core_info',
        term: 'enter_email'
    },
    {
        type: errorTypes.address,
        field: errorFields.country_code,
        severity: errorSeverities.critical,
        subType: errorSubTypes.no_shipping_to_address,
        showType: errorShowType.field,
        section: 'custom',
        term: 'cannot_ship_to_country',
    },
    {
        type: errorTypes.address,
        field: errorFields.province,
        severity: errorSeverities.critical,
        subType: errorSubTypes.no_shipping_to_address,
        showType: errorShowType.field,
        section: 'custom',
        term: 'cannot_ship_to_province',
    },
    {
        type: errorTypes.order,
        field: errorFields.postal_code,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'invalid_postal_code'
    },
    {
        type: errorTypes.address,
        field: errorFields.postal_code,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'invalid_postal_code'
    },
    {
        type: errorTypes.address,
        field: errorFields.province,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'select_province'
    },
    {
        type: errorTypes.address,
        field: errorFields.country_code,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'enter_country'
    },
    {
        type: errorTypes.address,
        field: errorFields.first_name,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'enter_first_name'
    },
    {
        type: errorTypes.address,
        field: errorFields.last_name,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'enter_last_name'
    },
    {
        type: errorTypes.address,
        field: errorFields.city,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'enter_city'
    },
    {
        type: errorTypes.address,
        field: errorFields.address_line_1,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'enter_address'
    },
    {
        type: errorTypes.address,
        field: errorFields.phone_number,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'invalid_phone_number'
    },
    {
        type: errorTypes.address,
        field: errorFields.business_name,
        severity: errorSeverities.validation,
        subType: errorSubTypes.empty,
        showType: errorShowType.field,
        section: 'shipping',
        term: 'enter_company'
    },
    {
        type: errorTypes.order,
        field: errorFields.discounts,
        severity: errorSeverities.validation,
        subType: errorSubTypes.discounts,
        showType: errorShowType.field,
        section: 'discount_code',
        term: 'discount_code_error'
    },
    {
        type: errorTypes.order,
        field: errorFields.discounts,
        severity: errorSeverities.validation,
        subType: errorSubTypes.discounts,
        showType: errorShowType.field,
        section: 'discount_code',
        term: 'require_shipping_page'
    },
    {
        type: errorTypes.order,
        field: errorFields.discounts,
        severity: errorSeverities.critical,
        subType: errorSubTypes.public_order_id,
        showType: errorShowType.flash,
        section: 'generic',
        term: 'unknown_error'
    },
    {
        type: errorTypes.order,
        field: errorFields.payment,
        severity: errorSeverities.validation,
        subType: errorSubTypes.payment,
        showType: errorShowType.flash,
        section: 'payment_gateway',
        term: 'unknown_error'
    },
    {
        type: errorTypes.order,
        field: errorFields.public_order_id,
        severity: errorSeverities.critical,
        subType: errorSubTypes.public_order_id,
        showType: errorShowType.flash,
        section: 'generic',
        term: 'unknown_error'
    },
    {
        type: errorTypes.order,
        field: errorFields.customer,
        severity: errorSeverities.validation,
        subType: errorSubTypes.customer,
        showType: errorShowType.flash,
        section: 'generic',
        term: 'unknown_error'
    },
    {
        type: errorTypes.order,
        field: errorFields.cart,
        severity: errorSeverities.validation,
        subType: errorSubTypes.cart,
        showType: errorShowType.flash,
        section: 'generic',
        term: 'unknown_error'
    },
    {
        type: errorTypes.order,
        field: errorFields.tax,
        severity: errorSeverities.validation,
        subType: errorSubTypes.tax,
        showType: errorShowType.flash,
        section: 'payment_gateway',
        term: 'no_tax'
    },
    {
        type: errorTypes.api,
        field: '',
        severity: errorSeverities.critical,
        subType: '',
        showType: errorShowType.flash,
        section: 'generic',
        term: 'unknown_error_try_again'
    },
    {
        type: errorTypes.order,
        field: errorFields.inventory,
        severity: errorSeverities.validation,
        subType: errorSubTypes.insufficient_stock,
        showType: errorShowType.none,
        section: '',
        term: ''
    },
    {
        type: errorTypes.authorization,
        field: errorFields.code,
        severity: errorSeverities.validation,
        subType: '',
        showType: errorShowType.field,
        section: '',
        term: ''
    },
    {
        type: errorTypes.validation,
        field: errorFields.discountsFlash,
        severity: errorSeverities.validation,
        subType: errorSubTypes.discounts,
        showType: errorShowType.discountFlash,
        section: 'discount_code',
        term: 'discount_code_removed'
    },
];
