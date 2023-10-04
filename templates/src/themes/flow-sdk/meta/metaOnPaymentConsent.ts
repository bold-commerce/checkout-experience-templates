import {
    IMetaFlowSettings,
    IMetaPaymentAuthorizationResult,
    IMetaPaymentResponse,
    IProcessOrderResponse,
} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {
    META_AUTHORIZATION_BILLING_ERROR,
    META_AUTHORIZATION_OTHER_ERROR,
    META_AUTHORIZATION_PAYMENT_ERROR,
    META_AUTHORIZATION_SHIPPING_ERROR,
    META_AUTHORIZATION_SUCCESS,
    META_OTHER_DATA_ERROR,
    META_PAYMENT_DATA_ERROR,
    META_SHIPPING_DATA_ERROR,
    META_BILLING_DATA_ERROR,
} from 'src/themes/flow-sdk/constants';
import {
    getFirstAndLastName,
    getTotals
} from '@boldcommerce/checkout-express-pay-library';
import {formatCheckoutAddressFromMeta} from 'src/themes/flow-sdk/meta/formatCheckoutAddressFromMeta';
import {
    addPayment,
    apiTypeKeys,
    apiTypes,
    batchRequest,
    getCurrency,
    IAddPaymentRequest,
    IApiBatchResponse,
    IApiSubrequestErrorsResponse,
    IApiSuccessResponse,
    IBatchableRequest,
    processOrder,
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {buildCustomerBatchRequest} from 'src/themes/flow-sdk/batch/buildCustomerBatchRequest';
import {buildAddressBatchRequest} from 'src/themes/flow-sdk/batch/buildAddressBatchRequest';
import {getErrorTermFromLibState} from 'src/utils';
import {getErrorWithField} from 'src/themes/flow-sdk/flow-utils/getErrorWithField';
import {addOnGoingRequest, removeOnGoingRequest} from 'src/themes/flow-sdk/manageFlowState';

export const metaOnPaymentConsent = async (response: IMetaPaymentResponse): Promise<IMetaPaymentAuthorizationResult> => {
    addOnGoingRequest('onPaymentConsent');
    const paymentDataError = {...META_PAYMENT_DATA_ERROR, message: getErrorTermFromLibState('payment_gateway', 'unknown_error')};
    const paymentMetaError = {...META_AUTHORIZATION_PAYMENT_ERROR, error: paymentDataError};

    const genericOtherDataError = {...META_OTHER_DATA_ERROR, message: getErrorTermFromLibState('generic', 'unknown_error')};
    const genericMetaError = {...META_AUTHORIZATION_OTHER_ERROR, error: genericOtherDataError};

    const taxesDataError = {...META_OTHER_DATA_ERROR, message: getErrorTermFromLibState('payment_gateway', 'no_tax')};
    const taxesMetaError = {...META_AUTHORIZATION_OTHER_ERROR, error: taxesDataError};

    // Tokenize containerData
    const {public_gateway_id: publicGatewayId} = checkoutFlow.flow_settings as IMetaFlowSettings;
    const tokenizeUrl = `${checkoutFlow.params.boldSecureUrl}/tokenize`;
    const options: RequestInit = {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'}),
        body: JSON.stringify({
            service: 'meta-sdk',
            version: 1,
            payment_gateway_id: publicGatewayId,
            payload: response.container.containerData,
        })
    };

    let tokenizePromise: Promise<Response>;
    try {
        tokenizePromise = fetch(tokenizeUrl, options);
    } catch (e) {
        removeOnGoingRequest('onPaymentConsent');
        return Promise.reject(paymentMetaError);
    }

    const {firstName, lastName} = getFirstAndLastName(response.billingAddress?.recipient || response.shippingAddress?.recipient);
    const formattedShippingAddress = formatCheckoutAddressFromMeta(response.shippingAddress, false);
    const formattedBillingAddress = formatCheckoutAddressFromMeta(response.billingAddress, false);

    // Build Batch Requests
    const requests: Array<IBatchableRequest> = [];

    const customerRequest = buildCustomerBatchRequest(firstName, lastName, response.payerEmail || '');
    const shippingAddressRequest = buildAddressBatchRequest(formattedShippingAddress, 'shipping');
    const billingAddressRequest = buildAddressBatchRequest(formattedBillingAddress, 'billing');

    customerRequest && requests.push(customerRequest);
    shippingAddressRequest && requests.push(shippingAddressRequest);
    billingAddressRequest && requests.push(billingAddressRequest);
    requests.push({apiType: apiTypeKeys.setTaxes, payload: {}});

    const batchResponse = await batchRequest(requests, API_RETRY);
    const batchInnerResponse = batchResponse.response as IApiBatchResponse;

    if (!batchResponse.success) {
        if (batchInnerResponse && Array.isArray(batchInnerResponse.data)) {
            for (const subResponse of batchInnerResponse.data) {
                if (subResponse.status_code < 200 || subResponse.status_code > 299) {
                    switch (subResponse.endpoint) {
                        case apiTypes.addGuestCustomer.path:
                        case apiTypes.updateCustomer.path: {
                            removeOnGoingRequest('onPaymentConsent');
                            return Promise.reject(genericMetaError);
                        }
                        case apiTypes.setShippingAddress.path:
                        case apiTypes.updateShippingAddress.path: {
                            const {errors} = subResponse as IApiSubrequestErrorsResponse;
                            const shippingDataError = getErrorWithField(errors, META_SHIPPING_DATA_ERROR);
                            const shippingMetaError = {...META_AUTHORIZATION_SHIPPING_ERROR, error: shippingDataError};

                            removeOnGoingRequest('onPaymentConsent');
                            return Promise.reject(shippingMetaError);
                        }
                        case apiTypes.setBillingAddress.path:
                        case apiTypes.updateBillingAddress.path: {
                            const {errors} = subResponse as IApiSubrequestErrorsResponse;
                            const updateBillingDataError = getErrorWithField(errors, META_BILLING_DATA_ERROR);
                            const updateBillingMetaError = {...META_AUTHORIZATION_BILLING_ERROR, error: updateBillingDataError};

                            removeOnGoingRequest('onPaymentConsent');
                            return Promise.reject(updateBillingMetaError);
                        }
                        case apiTypes.setTaxes.path:
                            removeOnGoingRequest('onPaymentConsent');
                            return Promise.reject(taxesMetaError);
                        default:
                            removeOnGoingRequest('onPaymentConsent');
                            return Promise.reject(genericMetaError);
                    }
                }
            }
        }

        removeOnGoingRequest('onPaymentConsent');
        return Promise.reject(genericMetaError);
    }

    const tokenizeResponse = await tokenizePromise;
    if (tokenizeResponse.status < 200 || tokenizeResponse.status > 299) {
        removeOnGoingRequest('onPaymentConsent');
        return Promise.reject(paymentMetaError);
    }

    const tokenizeJson = await tokenizeResponse.json();

    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue} = getTotals();
    const payment: IAddPaymentRequest = {
        token: tokenizeJson.data.token,
        gateway_public_id: publicGatewayId,
        currency: currencyCode,
        amount: totalAmountDue,
        extra_payment_data: {
            request_id: response.requestId
        }
    } as IAddPaymentRequest;

    const paymentResponse = await addPayment(payment, API_RETRY);
    if (!paymentResponse.success) {
        removeOnGoingRequest('onPaymentConsent');
        return Promise.reject(paymentMetaError);
    }

    const processOrderResponse = await processOrder(API_RETRY);
    if (!processOrderResponse.success) {
        removeOnGoingRequest('onPaymentConsent');
        return Promise.reject(paymentMetaError);
    }

    const processOrderInnerResponse = processOrderResponse.response as IApiSuccessResponse;
    const processOrderDataResponse = processOrderInnerResponse.data as IProcessOrderResponse;
    if (processOrderDataResponse.application_state?.is_processed) {
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_ORDER_COMPLETED', processOrderDataResponse);
        }
    } else {
        removeOnGoingRequest('onPaymentConsent');
        return Promise.reject(paymentMetaError);
    }

    logger({AuthorizationResult: META_AUTHORIZATION_SUCCESS}, 'info');
    removeOnGoingRequest('onPaymentConsent');
    return META_AUTHORIZATION_SUCCESS;
};
