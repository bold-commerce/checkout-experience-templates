import {
    IMetaPaymentDetailsChangedEvent,
    IMetaPaymentDetailsUpdate,
} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {metaBuildPaymentDetails} from 'src/themes/flow-sdk/meta/metaBuildPaymentDetails';
import {callBillingAddressEndpoint, callShippingAddressEndpoint} from '@boldcommerce/checkout-express-pay-library';
import {formatCheckoutAddressFromMeta} from 'src/themes/flow-sdk/meta/formatCheckoutAddressFromMeta';
import {changeShippingLine, getShipping, getShippingLines, setTaxes} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {
    META_BILLING_DATA_ERROR,
    META_FULFILLMENT_DATA_ERROR,
    META_SHIPPING_DATA_ERROR
} from 'src/themes/flow-sdk/constants';

export const metaOnPaymentDetailsChanged = async (event: IMetaPaymentDetailsChangedEvent): Promise<IMetaPaymentDetailsUpdate> => {
    logger(`Event.changeTypes: ${JSON.stringify(event.changeTypes, undefined, 4)}`, 'info');
    logger(`Event.paymentDetails.fulfillmentOptionId: ${JSON.stringify(event.paymentDetails.fulfillmentOptionId, undefined, 4)}`, 'info');
    logger(`Event.paymentDetails.fulfillmentOptions: ${JSON.stringify(event.paymentDetails.fulfillmentOptions, undefined, 4)}`, 'info');
    const {shippingAddress, billingAddress, fulfillmentOptionId} = event.paymentDetails;
    const paymentDetailsUpdate: IMetaPaymentDetailsUpdate = {paymentDetails: event.paymentDetails};
    

    if (event.changeTypes.includes('SHIPPING_ADDRESS')) {
        const formattedShippingAddress = formatCheckoutAddressFromMeta(shippingAddress, true);
        const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, false);
        
        if (!shippingAddressResponse.success) {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            paymentDetailsUpdate.errors.push(META_SHIPPING_DATA_ERROR);
        }
        await getShippingLines(API_RETRY);
        await setTaxes(API_RETRY);
        const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
        if (shippingLines.length > 0 && !selectedShipping) {
            await changeShippingLine(shippingLines[0].id, API_RETRY);
        }
    }

    if (event.changeTypes.includes('BILLING_ADDRESS')) {
        const metaBillingAddress = billingAddress ? billingAddress : shippingAddress;
        const formattedBillingAddress = formatCheckoutAddressFromMeta(metaBillingAddress, true);
        const billingAddressResponse = await callBillingAddressEndpoint(formattedBillingAddress, false);
        if (!billingAddressResponse.success) {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            paymentDetailsUpdate.errors.push(META_BILLING_DATA_ERROR);
        }
    }

    const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
    logger(`selected_shipping: ${JSON.stringify(selectedShipping, undefined, 4)}`, 'info');
    logger(`available_shipping_lines: ${JSON.stringify(shippingLines, undefined, 4)}`, 'info');
    if (event.changeTypes.includes('FULFILLMENT_OPTION_ID') || (!!fulfillmentOptionId && selectedShipping.id !== fulfillmentOptionId)) {
        const option = shippingLines.find(line => line.id === fulfillmentOptionId);
        if (option) {
            const shippingLineResponse = await changeShippingLine(option.id, API_RETRY);
            if (!shippingLineResponse.success) {
                if(paymentDetailsUpdate.errors === undefined){
                    paymentDetailsUpdate.errors = [];
                }
                paymentDetailsUpdate.errors.push(META_FULFILLMENT_DATA_ERROR);
            } else {
                await getShippingLines(API_RETRY);
            }
        } else {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            paymentDetailsUpdate.errors.push(META_FULFILLMENT_DATA_ERROR);
        }
    }

    paymentDetailsUpdate.paymentDetails = metaBuildPaymentDetails();
    logger(`Update.paymentDetails.fulfillmentOptionId: ${JSON.stringify(paymentDetailsUpdate.paymentDetails.fulfillmentOptionId, undefined, 4)}`, 'info');
    logger(`Update.paymentDetails.fulfillmentOptions: ${JSON.stringify(paymentDetailsUpdate.paymentDetails.fulfillmentOptions, undefined, 4)}`, 'info');
    return paymentDetailsUpdate;
};
