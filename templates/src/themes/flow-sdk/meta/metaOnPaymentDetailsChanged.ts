import {
    IMetaPaymentDataError,
    IMetaPaymentDetailsChangedEvent,
    IMetaPaymentDetailsUpdate,
} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {metaBuildPaymentDetails} from 'src/themes/flow-sdk/meta/metaBuildPaymentDetails';
import {callBillingAddressEndpoint, callShippingAddressEndpoint} from '@boldcommerce/checkout-express-pay-library';
import {formatCheckoutAddressFromMeta} from 'src/themes/flow-sdk/meta/formatCheckoutAddressFromMeta';
import {changeShippingLine, getShipping, getShippingLines, setTaxes} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';

export async function metaOnPaymentDetailsChanged(event: IMetaPaymentDetailsChangedEvent): Promise<IMetaPaymentDetailsUpdate> {
    logger(`Meta PaymentDetailsChangedEvent: ${JSON.stringify(event, undefined, 4)}`, 'info');
    const {shippingAddress, billingAddress, fulfillmentOptionId} = event.paymentDetails;

    const paymentDetailsUpdate: IMetaPaymentDetailsUpdate = {
        paymentDetails: event.paymentDetails,
        errors: [],
    };

    if (event.changeTypes.length > 0) {
        if (event.changeTypes.includes('SHIPPING_ADDRESS')) {
            const formatterShippingAddress = formatCheckoutAddressFromMeta(shippingAddress, true);
            logger(`Meta formatterShippingAddress: ${JSON.stringify(formatterShippingAddress, undefined, 4)}`, 'info');
            const shippingAddressResponse = await callShippingAddressEndpoint(formatterShippingAddress, false);
            logger(`Meta shippingAddressResponse: ${JSON.stringify(shippingAddressResponse, undefined, 4)}`, 'info');
            if (!shippingAddressResponse.success) {
                const shippingError: IMetaPaymentDataError = {
                    reason: 'INVALID_SHIPPING_ADDRESS',
                    message: shippingAddressResponse.error?.message || '',
                };
                paymentDetailsUpdate.errors?.push(shippingError);
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
            logger(`Meta formattedBillingAddress: ${JSON.stringify(formattedBillingAddress, undefined, 4)}`, 'info');
            const billingAddressResponse = await callBillingAddressEndpoint(formattedBillingAddress, false);
            logger(`Meta billingAddressResponse: ${JSON.stringify(billingAddressResponse, undefined, 4)}`, 'info');
            if (!billingAddressResponse.success) {
                const billingError: IMetaPaymentDataError = {
                    reason: 'INVALID_BILLING_ADDRESS',
                    message: billingAddressResponse.error?.message || '',
                };
                paymentDetailsUpdate.errors?.push(billingError);
            }
        }

        if (event.changeTypes.includes('FULFILLMENT_OPTION_ID')) {
            const {available_shipping_lines: shippingLines} = getShipping();
            const billingError: IMetaPaymentDataError = {
                reason: 'INVALID_FULFILLMENT_OPTION',
                field: 'fulfillmentOptionId'
            };
            const option = shippingLines.find(line => line.id === fulfillmentOptionId);
            logger(`Meta option: ${JSON.stringify(option, undefined, 4)}`, 'info');
            if (option) {
                const shippingLineResponse = await changeShippingLine(option.id, API_RETRY);
                if (!shippingLineResponse.success) {
                    paymentDetailsUpdate.errors?.push(billingError);
                } else {
                    await getShippingLines(API_RETRY);
                }
            } else {
                paymentDetailsUpdate.errors?.push(billingError);
            }
        }
    }

    paymentDetailsUpdate.paymentDetails = metaBuildPaymentDetails();
    logger(`Meta PaymentDetailsUpdate.errors: ${JSON.stringify(paymentDetailsUpdate.errors, undefined, 4)}`, 'info');
    return paymentDetailsUpdate;
}
