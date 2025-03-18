import {callShippingAddressEndpoint} from 'src/utils';
import {
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    IAddress,
    IApiReturnObject,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';

export async function updateOnShippingContactSelected(address: IAddress): Promise<void> {
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;

    let shippingResponse: IApiReturnObject;
    if(rsaEnabled) {
        shippingResponse = await estimateShippingLines(address, API_RETRY);
    } else {
        address.first_name = address.first_name.trim() || 'fistName';
        address.last_name = address.last_name.trim() || 'lastName';
        address.address_line_1 = address.address_line_1.trim() || 'addressLine1';
        address.phone_number = address.phone_number.trim() || '0000000000';
        shippingResponse = await callShippingAddressEndpoint(address, false);
    }

    if(shippingResponse.success) {
        let taxResponse: IApiReturnObject;
        let shippingResponseSuccess = true;

        if (rsaEnabled) {
            const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
            if (!selectedShipping && shippingLines.length > 0) {
                await changeShippingLine(shippingLines[0].id, API_RETRY);
            }
            await getShippingLines(API_RETRY);
            taxResponse = await estimateTaxes(address, API_RETRY);
        } else {
            const shippingLinesResponse = await getShippingLines(API_RETRY);
            shippingResponseSuccess = shippingLinesResponse.success;
            taxResponse = await setTaxes(API_RETRY);
        }
        if(taxResponse.success && shippingResponseSuccess){
            return;
        }
    }
}