import {
    IMetaPaymentDetailsChangedEvent,
    IMetaPaymentDetailsUpdate,
} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {metaBuildPaymentDetails} from 'src/themes/flow-sdk/meta/metaBuildPaymentDetails';
import {formatCheckoutAddressFromMeta} from 'src/themes/flow-sdk/meta/formatCheckoutAddressFromMeta';
import {
    addLog,
    apiTypeKeys,
    apiTypes,
    batchRequest,
    getDiscounts,
    getShipping,
    IApiBatchResponse,
    IApiSubrequestErrorsResponse,
    IBatchableRequest
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {
    META_BILLING_DATA_ERROR,
    META_FULFILLMENT_DATA_ERROR,
    META_GENERIC_DATA_ERROR,
    META_OFFER_DATA_ERROR,
    META_SHIPPING_DATA_ERROR
} from 'src/themes/flow-sdk/constants';
import {addOnGoingRequest, removeOnGoingRequest} from 'src/themes/flow-sdk/manageFlowState';
import {buildAddressBatchRequest} from 'src/themes/flow-sdk/batch/buildAddressBatchRequest';
import {hasAbortErrorOnResponse} from 'src/utils';
import {getTimerLog} from 'src/themes/flow-sdk/meta/getTimerLog';
import {getErrorWithField} from 'src/themes/flow-sdk/flow-utils/getErrorWithField';

export const metaOnPaymentDetailsChanged = async (event: IMetaPaymentDetailsChangedEvent): Promise<IMetaPaymentDetailsUpdate> => {
    const startTime = Math.floor(Date.now() / 1000);
    addOnGoingRequest('onPaymentDetailsChanged');
    logger({PaymentDetailsChangedEvent: {changeTypes: event.changeTypes}});
    const {shippingAddress, billingAddress, fulfillmentOptionId, offers} = event.paymentDetails;
    const paymentDetailsUpdate: IMetaPaymentDetailsUpdate = {paymentDetails: event.paymentDetails};
    const requests: Array<IBatchableRequest> = [];
    const {selected_shipping: selectedShipping} = getShipping();

    // Add request to update Order Shipping
    if (event.changeTypes.includes('SHIPPING_ADDRESS')) {
        const formattedShippingAddress = formatCheckoutAddressFromMeta(shippingAddress, true);
        const shippingAddressRequest = buildAddressBatchRequest(formattedShippingAddress, 'shipping');
        shippingAddressRequest && requests.push(shippingAddressRequest);
        requests.push({apiType: apiTypeKeys.getShippingLines, payload: {}});
        if (!selectedShipping) {
            requests.push({apiType: apiTypeKeys.changeShippingLines, payload: {index: '0'}});
        }
    }

    // Add request to update Order Billing
    if (event.changeTypes.includes('BILLING_ADDRESS')) {
        const metaBillingAddress = billingAddress ? billingAddress : shippingAddress;
        const formattedBillingAddress = formatCheckoutAddressFromMeta(metaBillingAddress, true);
        const billingAddressRequest = buildAddressBatchRequest(formattedBillingAddress, 'billing');
        billingAddressRequest && requests.push(billingAddressRequest);
    }

    // Add request to update Order Discounts
    if (event.changeTypes.includes('OFFERS')) {
        if (offers && Array.isArray(offers)) {
            const discounts = getDiscounts();
            for (const discount of discounts) {
                const existentOffer = offers.find(o => o.code === discount.code);
                if (!existentOffer) {
                    requests.push({apiType: apiTypeKeys.deleteDiscount, payload: {code: discount.code}});
                }
            }

            for (const offer of offers) {
                requests.push({apiType: apiTypeKeys.addDiscount, payload: {code: offer.code}});
            }
        }
    }

    // Add request to update Order Shipping Option
    if (event.changeTypes.includes('FULFILLMENT_OPTION_ID') || (!!fulfillmentOptionId && selectedShipping.id !== fulfillmentOptionId)) {
        requests.push({apiType: apiTypeKeys.changeShippingLines, payload: {index: fulfillmentOptionId}});
    }

    if (requests.length > 0) {
        // Add requests to Set Taxes
        requests.push({apiType: apiTypeKeys.setTaxes, payload: {}});

        // Execute Batch Request
        const batchResponse = await batchRequest(requests, API_RETRY);
        const batchInnerResponse = batchResponse.response as IApiBatchResponse;

        // Check for errors in Batch response
        if (!batchResponse.success) {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            if (hasAbortErrorOnResponse(batchResponse)) {
                paymentDetailsUpdate.errors.push(META_GENERIC_DATA_ERROR);
            }
            addLog(`META_CHECKOUT onPaymentDetailsChanged batch API failed ${getTimerLog(startTime)}`, 'meta_payment_details_changed_failed');

            if (batchInnerResponse && Array.isArray(batchInnerResponse.data)) {
                for (const subResponse of batchInnerResponse.data) {
                    if (subResponse.status_code < 200 || subResponse.status_code > 299) {
                        const {errors} = subResponse as IApiSubrequestErrorsResponse;
                        switch (subResponse.endpoint) {
                            case apiTypes.setShippingAddress.path:
                            case apiTypes.updateShippingAddress.path: {
                                const shippingDataError = getErrorWithField(errors, META_SHIPPING_DATA_ERROR);
                                paymentDetailsUpdate.errors.push(shippingDataError);
                                break;
                            }
                            case apiTypes.setBillingAddress.path:
                            case apiTypes.updateBillingAddress.path: {
                                const updateBillingDataError = getErrorWithField(errors, META_BILLING_DATA_ERROR);
                                paymentDetailsUpdate.errors.push(updateBillingDataError);
                                break;
                            }
                            case apiTypes.deleteDiscount.path:
                            case apiTypes.addDiscount.path: {
                                const updateOfferDataError = getErrorWithField(errors, META_OFFER_DATA_ERROR);
                                paymentDetailsUpdate.errors.push(updateOfferDataError);
                                break;
                            }
                            case apiTypes.changeShippingLines.path: {
                                const updateFulfillmentDataError = getErrorWithField(errors, META_FULFILLMENT_DATA_ERROR);
                                paymentDetailsUpdate.errors.push(updateFulfillmentDataError);
                                break;
                            }
                            default:
                                paymentDetailsUpdate.errors.push(META_GENERIC_DATA_ERROR);
                        }
                    }
                }
            } else {
                paymentDetailsUpdate.errors.push(META_GENERIC_DATA_ERROR);
            }
        }

        // Set first shipping lines if still none is selected after the previous batch.
        const {selected_shipping: afterBatchSelectedShipping, available_shipping_lines: afterBatchShippingLines} = getShipping();
        if (!paymentDetailsUpdate.errors
            && afterBatchShippingLines.length > 0
            && !afterBatchSelectedShipping) {
            const newRequests = [
                {apiType: apiTypeKeys.changeShippingLines, payload: {index: '0'}},
                {apiType: apiTypeKeys.setTaxes, payload: {}}
            ];

            // Execute New Batch Request
            const newBatchResponse = await batchRequest(newRequests, API_RETRY);
            if (!newBatchResponse.success) {
                if (paymentDetailsUpdate.errors === undefined) {
                    paymentDetailsUpdate.errors = [];
                }
                if (hasAbortErrorOnResponse(newBatchResponse)) {
                    paymentDetailsUpdate.errors.push(META_GENERIC_DATA_ERROR);
                }
                addLog(`META_CHECKOUT onPaymentDetailsChanged shipping lines batch API failed ${getTimerLog(startTime)}`, 'meta_payment_details_changed_failed');

                paymentDetailsUpdate.errors.push(META_FULFILLMENT_DATA_ERROR);
            }
        }
    }

    // Get Updated Order to paymentDetails
    paymentDetailsUpdate.paymentDetails = metaBuildPaymentDetails();
    logger({paymentDetailsUpdate});
    removeOnGoingRequest('onPaymentDetailsChanged');
    return paymentDetailsUpdate;
};
