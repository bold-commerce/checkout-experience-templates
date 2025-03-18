import {
    changeShippingLine,
    estimateTaxes,
    getOrderInitialData,
    getShippingAddress,
    getShippingLines,
    IApiReturnObject,
    IShippingLine,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';

export async function updateOnShippingMethodSelected(option: IShippingLine): Promise<void> {
    const {general_settings} = getOrderInitialData();
    const rsaEnabled = general_settings.checkout_process.rsa_enabled;
    const address = getShippingAddress();

    const response = await changeShippingLine(option.id, API_RETRY);
    if (response.success) {
        const shippingLinesResponse = await getShippingLines(API_RETRY);
        let taxResponse: IApiReturnObject;

        if (rsaEnabled) {
            taxResponse = await estimateTaxes(address, API_RETRY);
        } else {
            taxResponse = await setTaxes(API_RETRY);
        }

        if (shippingLinesResponse.success && taxResponse.success) {
            return;
        }
    }
}