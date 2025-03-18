import {
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    IApiErrorResponse,
    setShippingAddress,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {formatStripeShippingAddress} from 'src/utils/formatStripeShippingAddress';
import {retrieveErrorFromResponse} from 'src/utils';
import {IOnUpdateStripePayload} from 'src/types';


export async function stripeUpdateOrder(payload: IOnUpdateStripePayload): Promise<void> {
    const {shipping_address, shipping_options} = payload.payment_data;
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;
    let address;

    if(shipping_address){
        address = formatStripeShippingAddress(shipping_address, shipping_address.phone);
        let shippingLinesResponse;
        if (rsaEnabled) {
            shippingLinesResponse = await estimateShippingLines(address);
        } else {
            const response = await setShippingAddress(address);
            if (response.success) {
                shippingLinesResponse = await getShippingLines();
            }
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

    if(shipping_options) {
        const changeShippingResponse = await changeShippingLine(shipping_options.id);
        if(!changeShippingResponse.success){
            const error = retrieveErrorFromResponse(changeShippingResponse) as IApiErrorResponse;
            throw new Error(error.message);
        }
    }

    let taxResponse;
    if (rsaEnabled) {
        taxResponse = await estimateTaxes(address);
    } else {
        taxResponse = await setTaxes();
    }

    if(!taxResponse.success){
        const error = retrieveErrorFromResponse(taxResponse) as IApiErrorResponse;
        throw new Error(error.message);
    }
}
