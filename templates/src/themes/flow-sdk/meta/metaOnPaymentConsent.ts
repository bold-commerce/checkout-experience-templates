import {
    IMetaFlowSettings,
    IMetaPaymentAuthorizationResult,
    IMetaPaymentResponse,
    IProcessOrderResponse
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
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    getFirstAndLastName, getTotals
} from '@boldcommerce/checkout-express-pay-library';
import {formatCheckoutAddressFromMeta} from 'src/themes/flow-sdk/meta/formatCheckoutAddressFromMeta';
import {
    addPayment,
    getCurrency,
    IAddPaymentRequest,
    IApiSuccessResponse,
    processOrder,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export const metaOnPaymentConsent = async (response: IMetaPaymentResponse): Promise<IMetaPaymentAuthorizationResult> => {
    //Update Order Customer
    const {firstName, lastName} = getFirstAndLastName(response.billingAddress?.recipient || response.shippingAddress?.recipient);
    const customerResult = await callGuestCustomerEndpoint(firstName, lastName, response.payerEmail || '');
    if (!customerResult.success) {
        return Promise.reject(META_AUTHORIZATION_OTHER_ERROR); //TODO Return Specific Authorization Error for customer data
    }

    //Update Order Shipping
    const formattedShippingAddress = formatCheckoutAddressFromMeta(response.shippingAddress, false);
    const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, false);
    if (!shippingAddressResponse.success) {
        return Promise.reject(META_AUTHORIZATION_SHIPPING_ERROR);
    }

    // Update Order Billing
    const formattedBillingAddress = formatCheckoutAddressFromMeta(response.billingAddress, false);
    const billingAddressResponse = await callBillingAddressEndpoint(formattedBillingAddress, false);
    if (!billingAddressResponse.success) {
        return Promise.reject(META_AUTHORIZATION_BILLING_ERROR);
    }

    // Update Order Taxes
    const taxesResponse = await setTaxes(API_RETRY);
    if (!taxesResponse.success) {
        return Promise.reject(META_AUTHORIZATION_OTHER_ERROR); //TODO Return Specific Authorization Error for calculating taxes data
    }

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
    const tokenizeResponse = await fetch(tokenizeUrl, options);
    if (tokenizeResponse.status < 200 || tokenizeResponse.status >= 300) {
        return Promise.reject(META_AUTHORIZATION_PAYMENT_ERROR);
    }

    // Add Order Payment
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

    const paymentResult = await addPayment(payment, API_RETRY);
    if (!paymentResult.success) {
        return Promise.reject(META_AUTHORIZATION_PAYMENT_ERROR);
    }

    // Process Order (Authorize Payment)
    const processOrderResponse = await processOrder(API_RETRY);
    if (!processOrderResponse.success) {
        return Promise.reject(META_AUTHORIZATION_ERROR); //TODO Return Specific Authorization Error for Processing Order
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
