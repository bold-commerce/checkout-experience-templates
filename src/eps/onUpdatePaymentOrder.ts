import {getShipping, IWalletPayOnShippingRequest, walletPayOnShipping} from '@boldcommerce/checkout-frontend-library';
import {
    IApplePayOnUpdatePayload,
    IBraintreePaypalOnUpdatePaymentPayload,
    IGatewayType,
    IGooglePayOnUpdatePayload,
    IOnUpdateStripePayload,
    IOrderDataPayload
} from 'src/types';
import {formatApplePayContactToCheckoutAddress, formatShippingAddressGoogle} from 'src/utils';
import {
    braintreeAppleUpdateOrder,
    braintreeGoogleUpdateOrder,
    braintreePaypalUpdateOrder,
    onRequireOrderData,
    stripeUpdateOrder,
    updateOnShippingContactSelected,
    updateOnShippingMethodSelected
} from 'src/eps';

import ApplePayShippingMethod = ApplePayJS.ApplePayShippingMethod;
import GooglePayAddress = google.payments.api.IntermediateAddress;
import GooglePaySelectionOption = google.payments.api.SelectionOption
type IPayload = IWalletPayOnShippingRequest | IApplePayOnUpdatePayload | IGooglePayOnUpdatePayload | IBraintreePaypalOnUpdatePaymentPayload;

export async function onUpdatePaymentOrder(type: IGatewayType, payload: IPayload): Promise<Record<string, unknown> | IOrderDataPayload> {
    switch (type) {
        case 'ppcp': {
            if (payload.payment_data &&
                (payload.payment_data['payment_type'] === 'apple' || payload.payment_data['payment_type'] === 'google')) {
                const type = payload.payment_data['payment_type'];
                const {require_order_data: requirements} = payload as IApplePayOnUpdatePayload | IGooglePayOnUpdatePayload;
                const {shipping_address, shipping_options} = payload.payment_data;
                if (shipping_address) {
                    const shippingAddress = type === 'apple' ? formatApplePayContactToCheckoutAddress(shipping_address) : formatShippingAddressGoogle((shipping_address as GooglePayAddress));
                    await updateOnShippingContactSelected(shippingAddress);
                }
                if (shipping_options) {
                    const {available_shipping_lines: shippingLines} = getShipping();
                    const option = shippingLines.find(line =>
                        line.id === (shipping_options as ApplePayShippingMethod).identifier
                        || line.id === (shipping_options as GooglePaySelectionOption).id
                    );
                    if (option) {
                        await updateOnShippingMethodSelected(option);
                    }
                }
                if (requirements) {
                    return onRequireOrderData(requirements);
                }
            } else {
                const response = await walletPayOnShipping(payload as IWalletPayOnShippingRequest);
                return {success: response.success};
            }
            break;
        }
        case 'braintree': {
            if (payload.payment_data && (payload.payment_data['payment_type'] === 'apple' || payload.payment_data['payment_type'] === 'google' || payload.payment_data['payment_type'] === 'paypal' )) {
                const {require_order_data: requirements} = payload as IGooglePayOnUpdatePayload;
                const type = payload.payment_data['payment_type'];
                if (type === 'google') {
                    await braintreeGoogleUpdateOrder(payload as IGooglePayOnUpdatePayload);
                } else if (type === 'apple') {
                    await braintreeAppleUpdateOrder(payload as IApplePayOnUpdatePayload);
                } else {
                    await braintreePaypalUpdateOrder(payload as IBraintreePaypalOnUpdatePaymentPayload);
                }
                if (requirements) {
                    return onRequireOrderData(requirements);
                }
            }
            throw new Error('Invalid payment data for braintree');
        }
        case 'stripe': {
            const {require_order_data: requirements} = payload as IOnUpdateStripePayload;
            await stripeUpdateOrder(payload as IOnUpdateStripePayload);
            if (requirements) {
                return onRequireOrderData(requirements);
            }
            throw new Error('Invalid payment data for stripe');
        }
    }
    throw new Error('Function not implemented for this payment gateway');
}
