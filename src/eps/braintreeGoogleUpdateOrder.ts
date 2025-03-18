import {
    changeShippingLine,
    estimateShippingLines, estimateTaxes,
    getOrderInitialData, getShipping, getShippingLines, IApiReturnObject, setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {IGooglePayOnUpdatePayload} from 'src/types';
import {formatShippingAddressGoogle, callShippingAddressEndpoint} from 'src/utils';
import Address = google.payments.api.Address;
import {API_RETRY, BRAINTREE_GOOGLE_EMPTY_SHIPPING_OPTION} from 'src/constants';


export async function braintreeGoogleUpdateOrder(payload: IGooglePayOnUpdatePayload): Promise<void> {

    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;
    const {shipping_address, shipping_options} = payload.payment_data;
    let shippingLinesResponse: IApiReturnObject;
    const address = formatShippingAddressGoogle(shipping_address as Address, true);
    if (rsaEnabled) {
        shippingLinesResponse = await estimateShippingLines(address, API_RETRY);
    } else {
        const shippingAddressResponse = await callShippingAddressEndpoint(address, false);
        if (!shippingAddressResponse.success) {
            throw new Error('Fail to get shipping lines');
        }
        shippingLinesResponse = await getShippingLines(API_RETRY);
    }

    const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
    if (shippingLinesResponse.success) {
        if (shipping_options && shipping_options.id !== BRAINTREE_GOOGLE_EMPTY_SHIPPING_OPTION) {
            const option = shippingLines.find(line => line.id === shipping_options.id);
            option && await changeShippingLine(option.id, API_RETRY);
        } else if (!selectedShipping && shippingLines.length > 0) {
            await changeShippingLine(shippingLines[0].id, API_RETRY);
        }
        await getShippingLines(API_RETRY);
    }

    if (rsaEnabled) {
        await estimateTaxes(address, API_RETRY);
    } else {
        await setTaxes(API_RETRY);
    }
}
