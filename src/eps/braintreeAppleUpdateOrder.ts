import {
    getShipping
} from '@boldcommerce/checkout-frontend-library';
import {IApplePayOnUpdatePayload} from 'src/types';
import {formatApplePayContactToCheckoutAddress} from 'src/utils';
import {updateOnShippingMethodSelected} from 'src/eps/updateOnShippingMethodSelected';
import {updateOnShippingContactSelected} from 'src/eps/updateOnShippingContactSelected';
import ApplePayShippingMethod = ApplePayJS.ApplePayShippingMethod;


export async function braintreeAppleUpdateOrder(payload: IApplePayOnUpdatePayload): Promise<void> {
    const {shipping_address, shipping_options} = payload.payment_data;
    if (shipping_address) {
        const shippingAddress = formatApplePayContactToCheckoutAddress(shipping_address);
        await updateOnShippingContactSelected(shippingAddress);
    }
    if (shipping_options) {
        const {available_shipping_lines: shippingLines} = getShipping();
        const option = shippingLines.find(line => line.id === (shipping_options as ApplePayShippingMethod).identifier);
        if (option) {
            await updateOnShippingMethodSelected(option);

        }
    }
}
