import {IFlowType, IMetaPaymentAuthorizationResult, IMetaPaymentDataError} from 'src/themes/flow-sdk/types';

export const flowType: IFlowType = {
    META: 'meta',
};

export const META_CLIENT_VERSION = '1.0';
export const META_SDK_URL = 'https://static.xx.fbcdn.net/payments_sdk/v1/metapay_sdk.js';
export const META_OTHER_DATA_ERROR: IMetaPaymentDataError = {reason: 'OTHER_ERROR'};
export const META_SHIPPING_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_SHIPPING_ADDRESS'};
export const META_BILLING_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_BILLING_ADDRESS'};
export const META_FULFILLMENT_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_FULFILLMENT_OPTION', field: 'fulfillmentOptionId'};
export const META_PAYMENT_DATA_ERROR: IMetaPaymentDataError = {reason: 'INVALID_PAYMENT_DATA'};
export const META_AUTHORIZATION_SUCCESS: IMetaPaymentAuthorizationResult = {authorizationState: 'SUCCESS'};
export const META_AUTHORIZATION_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR'};
export const META_AUTHORIZATION_OTHER_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_OTHER_DATA_ERROR};
export const META_AUTHORIZATION_SHIPPING_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_SHIPPING_DATA_ERROR};
export const META_AUTHORIZATION_BILLING_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_BILLING_DATA_ERROR};
export const META_AUTHORIZATION_PAYMENT_ERROR: IMetaPaymentAuthorizationResult = {authorizationState: 'ERROR', error: META_PAYMENT_DATA_ERROR};
