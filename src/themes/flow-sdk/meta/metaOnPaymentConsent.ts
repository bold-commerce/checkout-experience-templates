import {
    IMetaFlowSettings,
    IMetaPaymentAuthorizationResult,
    IMetaPaymentResponse,
    IProcessOrderResponse,
} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {
    META_AUTHORIZATION_BILLING_ERROR,
    META_AUTHORIZATION_ERROR,
    META_AUTHORIZATION_OTHER_ERROR,
    META_AUTHORIZATION_PAYMENT_ERROR,
    META_AUTHORIZATION_SHIPPING_ERROR,
    META_AUTHORIZATION_SUCCESS,
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
    IApiSuccessResponse,
    IBatchableRequest,
    processOrder,
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {buildCustomerBatchRequest} from 'src/themes/flow-sdk/batch/buildCustomerBatchRequest';
import {buildAddressBatchRequest} from 'src/themes/flow-sdk/batch/buildAddressBatchRequest';

export const metaOnPaymentConsent = async (response: IMetaPaymentResponse): Promise<IMetaPaymentAuthorizationResult> => {
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
    const tokenizePromise = fetch(tokenizeUrl, options);

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
                        case apiTypes.updateCustomer.path:
                            return Promise.reject(META_AUTHORIZATION_OTHER_ERROR);
                        case apiTypes.setShippingAddress.path:
                        case apiTypes.updateShippingAddress.path:
                            return Promise.reject(META_AUTHORIZATION_SHIPPING_ERROR);
                        case apiTypes.setBillingAddress.path:
                        case apiTypes.updateBillingAddress.path:
                            return Promise.reject(META_AUTHORIZATION_BILLING_ERROR);
                        case apiTypes.setTaxes.path:
                            return Promise.reject(META_AUTHORIZATION_OTHER_ERROR);
                        default:
                            return Promise.reject(META_AUTHORIZATION_OTHER_ERROR);
                    }
                }
            }
        }

        return Promise.reject(META_AUTHORIZATION_OTHER_ERROR);
    }

    const tokenizeResponse = await tokenizePromise;
    if (tokenizeResponse.status < 200 || tokenizeResponse.status > 299) {
        return Promise.reject(META_AUTHORIZATION_PAYMENT_ERROR);
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
        return Promise.reject(META_AUTHORIZATION_PAYMENT_ERROR);
    }

    const processOrderResponse = await processOrder(API_RETRY);
    if (!processOrderResponse.success) {
        return Promise.reject(META_AUTHORIZATION_ERROR);
    }

    const processOrderInnerResponse = processOrderResponse.response as IApiSuccessResponse;
    const processOrderDataResponse = processOrderInnerResponse.data as IProcessOrderResponse;
    if (processOrderDataResponse.application_state?.is_processed) {
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_ORDER_COMPLETED', processOrderDataResponse);
        }
    } else {
        return Promise.reject(META_AUTHORIZATION_ERROR);
    }

    logger({AuthorizationResult: META_AUTHORIZATION_SUCCESS}, 'info');
    return META_AUTHORIZATION_SUCCESS;
};
