import {
    IAddress,
    IApiSuccessResponse,
    IWalletPayCreateOrderRequest,
    IWalletPayCreateOrderResponse,
    walletPayCreateOrder
} from '@boldcommerce/checkout-frontend-library';
import {
    IApplePayOnApprovePayload,
    IGatewayType,
    IGooglePayOnApprovePayload,
    IOnCreatePaymentOrderResponse
} from 'src/types';
import {formatApplePayContactToCheckoutAddress, formatShippingAddressGoogle} from 'src/utils';
import {hydrateOrder} from 'src/eps';

import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

export async function onCreatePaymentOrder(type: IGatewayType, payload: IWalletPayCreateOrderRequest | IApplePayOnApprovePayload | IGooglePayOnApprovePayload): Promise<IOnCreatePaymentOrderResponse> {
    switch (type) {
        case 'ppcp': {
            if (payload.payment_data &&
                (payload.payment_data['payment_type'] === 'apple' || payload.payment_data['payment_type'] === 'google')) {
                const type = payload.payment_data['payment_type'];
                let shippingAddress: IAddress | undefined;
                let billingAddress: IAddress | undefined;
                let firstName = '';
                let lastName = '';
                let email = '';

                if (type === 'apple') {
                    const {shipping_address, billing_address} = (payload as IApplePayOnApprovePayload).payment_data;
                    const {
                        givenName,
                        familyName,
                        emailAddress,
                        phoneNumber
                    } = shipping_address ?? {} as ApplePayPaymentContact;
                    firstName = givenName || '';
                    lastName = familyName || '';
                    email = emailAddress || '';

                    if (!shipping_address || !billing_address) {
                        throw new Error('Missing updated shipping and billing addresses');
                    }

                    if (billing_address && !billing_address.phoneNumber && phoneNumber) {
                        billing_address.phoneNumber = phoneNumber;
                    }

                    shippingAddress = formatApplePayContactToCheckoutAddress(shipping_address);
                    billingAddress = formatApplePayContactToCheckoutAddress(billing_address);

                    if (shippingAddress && billingAddress) {
                        await hydrateOrder(shippingAddress, billingAddress, firstName, lastName, email);
                    } else {
                        throw new Error('Missing shipping and billing addresses to hydrate the order');
                    }
                } else if (type === 'google') {
                    const {
                        shipping_address,
                        billing_address,
                        customer
                    } = (payload as IGooglePayOnApprovePayload).payment_data;
                    const isWalletRender = (payload as IGooglePayOnApprovePayload).payment_data.is_wallet_pay ?? true;
                    firstName = customer?.first_name || '';
                    lastName = customer?.last_name || '';
                    email = customer?.email_address || '';

                    if(isWalletRender) {
                        if (!shipping_address || !billing_address) {
                            throw new Error('Missing updated shipping and billing addresses');
                        }

                        shippingAddress = formatShippingAddressGoogle(shipping_address);
                        billingAddress = formatShippingAddressGoogle(billing_address);

                        if (shippingAddress && billingAddress) {
                            await hydrateOrder(shippingAddress, billingAddress, firstName, lastName, email);
                        } else {
                            throw new Error('Missing shipping and billing addresses to hydrate the order');
                        }
                    }
                }
            }

            const paymentResult = await walletPayCreateOrder(payload);
            if (paymentResult.success) {
                const {data} = paymentResult.response as IApiSuccessResponse;
                const {payment_data} = data as IWalletPayCreateOrderResponse;
                const orderId = payment_data.id as string;
                return {payment_data: {id: orderId}};
            } else {
                throw new Error('Unable to create order');
            }
        }
    }
    throw new Error('Function not implemented for payment gateway');
}
