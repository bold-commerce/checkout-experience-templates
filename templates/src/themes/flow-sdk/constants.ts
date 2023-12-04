import {IFlowType, IMetaPaymentAuthorizationResult, IMetaPaymentDataError, IMetaPaymentDataErrorField} from 'src/themes/flow-sdk/types';
import {IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';

export const flowType: IFlowType = {
    META: 'meta',
};

export const ADD_LOG_MESSAGE_MAX_SIZE = 200;
export const ADD_LOG_DETAILS_MAX_SIZE = 700;
export const META_TIMEOUT_SECONDS = 29; // Meta shared the Timeout count is 30 seconds, so anything above 29s would have timeout.
export const META_CLIENT_VERSION = '1.0';
export const META_SDK_URL = 'https://static.xx.fbcdn.net/payments_sdk/v1/metapay_sdk.js';
export const META_OTHER_DATA_ERROR: IMetaPaymentDataError = {reason: 'OTHER_ERROR'};
export const META_GENERIC_DATA_ERROR: IMetaPaymentDataError = {reason: 'GENERIC_FAILURE'};
export const META_SHIPPING_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_SHIPPING_ADDRESS'};
export const META_BILLING_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_BILLING_ADDRESS'};
export const META_OFFER_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_OFFER_CODE'};
export const META_FULFILLMENT_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_FULFILLMENT_OPTION', field: 'fulfillmentOptionId'};
export const META_PAYMENT_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_PAYMENT_DATA'};
export const META_AUTHORIZATION_SUCCESS: IMetaPaymentAuthorizationResult = {authorizationState: 'SUCCESS'};
export const META_AUTHORIZATION_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR'};
export const META_AUTHORIZATION_OTHER_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_OTHER_DATA_ERROR};
export const META_AUTHORIZATION_SHIPPING_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_SHIPPING_DATA_ERROR};
export const META_AUTHORIZATION_BILLING_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_BILLING_DATA_ERROR};
export const META_AUTHORIZATION_PAYMENT_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_PAYMENT_DATA_ERROR};


export const MetaAddressPlaceholders = {
    first_name: 'firstname',
    last_name: 'lastname',
    address_line_1: 'addressLine1',
    phone_number: '0000000000',
};

export const MetaFields: {[key: string]: IMetaPaymentDataErrorField} = {
    email_address: 'payerEmail',
    email: 'payerEmail',
    postal_code: 'postalCode',
    country_code: 'country',
    province: 'region',
    phone_number: 'payerPhone',
    first_name: 'recipient',
    last_name: 'recipient',
    address_line_1: 'addressLine',
    city: 'city',
    customer: 'recipient',
    business_name: 'organization',
};

export const baseMetadataRequest: IPatchOrderMetaDataRequest = {
    cart_parameters: null,
    note_attributes: null,
    notes: null,
    tags: null
};
