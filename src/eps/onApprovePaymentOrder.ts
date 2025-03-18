import {IWalletPayOnApproveRequest, walletPayOnApprove} from '@boldcommerce/checkout-frontend-library';
import {HistoryLocationState} from 'react-router';
import {Dispatch} from 'redux';
import {actionAddError} from 'src/action';
import {displayOrderProcessingScreen, getApplicationStateFromLib, processOrder} from 'src/library';
import {
    IApplePayOnApprovePayload,
    IBraintreePaypalOnApprovePayload,
    IError,
    IGatewayType,
    IGooglePayOnApprovePayload,
    IOnApproveStripePayload,
    IPaymentInformation
} from 'src/types';
import {
    formatApplePayContactToCheckoutAddress,
    formatShippingAddressGoogle,
    getFirstAndLastName,
    formatStripeShippingAddress,
    formatStripeBillingAddress,
    formatBraintreePaypalAddress
} from 'src/utils';
import {hydrateOrder} from 'src/eps/hydrateOrder';
import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;

export async function onApprovePaymentOrder(dispatch: Dispatch,  history: HistoryLocationState, type: IGatewayType, paymentInformation: IPaymentInformation, payload: Record<string, unknown> | IApplePayOnApprovePayload | IGooglePayOnApprovePayload | IOnApproveStripePayload | IBraintreePaypalOnApprovePayload): Promise<void> {

    switch (type) {
        case 'ppcp': {
            let success: boolean;
            if (payload.payment_data &&
                (payload.payment_data['payment_type'] === 'apple' || payload.payment_data['payment_type'] === 'google')) {
                success = true;
                await dispatch(getApplicationStateFromLib);
            } else {
                const response = await walletPayOnApprove(payload as unknown as IWalletPayOnApproveRequest);
                success = response.success;
            }

            if (success) {
                dispatch(displayOrderProcessingScreen);
                await dispatch(processOrder(history));
            } else {
                const error: IError = {
                    field: '', message: 'unable to process the payment', severity: '', sub_type: '', type: ''
                };
                dispatch(actionAddError(error));
            }
            return;
        }
        case 'braintree':
            if (payload.payment_data && (payload.payment_data['payment_type'] === 'apple' || payload.payment_data['payment_type'] === 'google' || payload.payment_data['payment_type'] === 'paypal')) {
                const type = payload.payment_data['payment_type'];
                if (type === 'google') {
                    const {shipping_address, billing_address, email} = (payload as IGooglePayOnApprovePayload).payment_data;
                    const is_wallet_pay = (payload as IGooglePayOnApprovePayload).payment_data.is_wallet_pay ?? true;
                    if (is_wallet_pay) {
                        const formattedShippingAddress = formatShippingAddressGoogle(shipping_address);
                        const formattedBillingAddress = formatShippingAddressGoogle(billing_address);
                        await hydrateOrder(formattedShippingAddress, formattedBillingAddress, formattedBillingAddress.first_name, formattedBillingAddress.last_name, email ?? '');
                    }
                } else if (type === 'apple') {
                    const {shipping_address, billing_address} = (payload as IApplePayOnApprovePayload).payment_data;
                    const {
                        givenName,
                        familyName,
                        emailAddress
                    } = shipping_address ?? {} as ApplePayPaymentContact;

                    if (!shipping_address || !billing_address) {
                        throw new Error('Missing updated shipping and billing addresses');
                    }
                    const formattedShippingAddress = formatApplePayContactToCheckoutAddress(shipping_address);
                    const formattedBillingAddress = formatApplePayContactToCheckoutAddress(billing_address);
                    await hydrateOrder(formattedShippingAddress, formattedBillingAddress, givenName || '', familyName || '',  emailAddress || '');
                } else {
                    const {shipping_address, billing_address, customer, is_wallet_pay} = (payload as IBraintreePaypalOnApprovePayload).payment_data;
                    if (!shipping_address || !billing_address) {
                        throw new Error('Missing updated shipping and billing addresses');
                    }

                    if (is_wallet_pay) {
                        const formattedShippingAddress = formatBraintreePaypalAddress(shipping_address, customer);
                        const formattedBillingAddress = formatBraintreePaypalAddress(billing_address, customer);
                        await hydrateOrder(formattedShippingAddress, formattedBillingAddress, customer.first_name, customer.last_name,  customer.email_address);
                    }
                }
            }
            await dispatch(getApplicationStateFromLib);
            dispatch(displayOrderProcessingScreen);
            await dispatch(processOrder(history));
            return;
        case 'stripe': {
            const data = (payload as IOnApproveStripePayload).payment_data;
            const {firstName, lastName} = getFirstAndLastName(data.customer?.payerName);
            const formattedShippingAddress = formatStripeShippingAddress(data.shipping_address, data.shipping_address.phone);
            const formattedBillingAddress = formatStripeBillingAddress(data.card, data.customer.payerName, data.customer.payerPhone);
            await hydrateOrder(formattedShippingAddress, formattedBillingAddress, firstName || '', lastName || '', data.customer?.payerEmail ?? '');
            await dispatch(getApplicationStateFromLib);
            dispatch(displayOrderProcessingScreen);
            await dispatch(processOrder(history));
            return;
        }
        default:
            throw new Error('Function not implemented for this payment gateway');
    }
}
