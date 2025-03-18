import {
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingAddress,
    getShippingLines,
    IApiErrorResponse,
    setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {
    IBraintreePaypalOnUpdatePaymentPayload,
    IBraintreePaypalShippingAddress
} from 'src/types';
import {formatBraintreePaypalPartialShippingAddress, isObjectEquals, retrieveErrorFromResponse, callShippingAddressEndpoint} from 'src/utils';
import {API_RETRY} from 'src/constants';


export async function braintreePaypalUpdateOrder(payload: IBraintreePaypalOnUpdatePaymentPayload): Promise<void> {

    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;
    const {shipping_address, shipping_options} = payload.payment_data;
    let address;
    if (shipping_address) {
        address = formatBraintreePaypalPartialShippingAddress(shipping_address as IBraintreePaypalShippingAddress);
        if (!isObjectEquals(address, getShippingAddress())) {
            let shippingLinesResponse;
            if (rsaEnabled) {
                shippingLinesResponse = await estimateShippingLines(address, API_RETRY);
            } else {
                const shippingAddressResponse = await callShippingAddressEndpoint(address, false);
                if (!shippingAddressResponse.success) {
                    throw new Error('Fail to get shipping lines');
                }
                shippingLinesResponse = await getShippingLines(API_RETRY);
            }

            if (shippingLinesResponse && shippingLinesResponse.success) {
                const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
                if (!selectedShipping && shippingLines.length > 0) {
                    await changeShippingLine(shippingLines[0].id);
                }
            } else {
                const error = retrieveErrorFromResponse(shippingLinesResponse) as IApiErrorResponse;
                throw new Error(error.message);
            }
        }
    }

    if (shipping_options) {
        const {available_shipping_lines: shippingLines} = getShipping();
        const option = shippingLines.find(line => line.description === shipping_options.label);
        option && await changeShippingLine(option.id, API_RETRY);
    }

    if (rsaEnabled) {
        await estimateTaxes(address, API_RETRY);
    } else {
        await setTaxes(API_RETRY);
    }
}
