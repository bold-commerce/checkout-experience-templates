import {getTerm} from 'src/utils';
import {getGiftCardDisplayFormat} from 'src/utils';
import {IPayment} from '@boldcommerce/checkout-frontend-library';

export function useGetPaymentType(props: IPayment): string {
    const {driver, lineText, display_string: displayString, type} = props; // TODO: remove driver and lineText and change displayString to displayText after FF CE-539-Add-PaymentLine-Model is Enabled by default
    if (driver && type) { // TODO: change condition to (!type) after FF CE-539-Add-PaymentLine-Model is Enabled by default
        return '';
    }
    const displayText = displayString ? displayString : lineText ?? ''; // TODO: remove after FF CE-539-Add-PaymentLine-Model is Enabled by default
    const formattedType = type ? type.toLowerCase().replace(/\s|_/g, '') : ''; // TODO: change variable to paymentType after FF CE-539-Add-PaymentLine-Model is Enabled by default
    const formattedDriver = driver ? driver.toLowerCase().replace(/\s|_/g, '') : ''; // TODO: remove after FF CE-539-Add-PaymentLine-Model is Enabled by default
    const paymentType = formattedType ? formattedType : formattedDriver; // TODO: remove after FF CE-539-Add-PaymentLine-Model is Enabled by default

    // Gift Card (any type)
    if (paymentType.includes('giftcard')) {
        return `${getTerm('gift_card', 'payment_method')}: ${getGiftCardDisplayFormat(displayText)}`;
    }

    switch (paymentType) {
        case 'paypal':
        case 'paypalbraintree':
        case 'paypalpaypal':
            return `${getTerm('paypal', 'payment_method')}: ${displayText}`;
        // Amazon
        case 'amazon':
        case 'amazonpay':
            return `${getTerm('amazon', 'payment_method')}: ${displayText}`;
        // Venmo
        case 'venmo':
        case 'venmobraintree':
            return `${getTerm('venmo', 'payment_method')}: ${displayText}`;
        // Payment by Plugin
        case 'pluginv2':
            return `${getTerm('plugin', 'payment_method')}: ${displayText}`;
        // Other - Branded Cards - Credit cards
        // PPCP
        // case 'paypalpaypalcommerceplatform':
        //     return displayText;
        default:
            return displayText;
    }
}
