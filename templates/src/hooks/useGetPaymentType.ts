import {IApplicationStatePayment, IDisplayPaymentMethod} from 'src/types';
import {getTerm} from 'src/utils';
import {getCardDisplayFormat, getGiftCardDisplayFormat} from 'src/utils';

export function useGetPaymentType(props: IApplicationStatePayment): IDisplayPaymentMethod {
    if (!props.tag || !props.driver) {
        return {paymentMethodName: '', paymentMethodValue: ''};
    }
    const lineText = props.lineText ? props.lineText : '';

    // Gift Card (any type)
    if (props.tag.toLowerCase().includes('giftcard')) {

        return {
            paymentMethodName: getTerm('gift_card', 'payment_method'),
            paymentMethodValue: getGiftCardDisplayFormat(lineText),
        };
    }

    // Amazon Pay
    if (props.driver.toLowerCase().includes('amazon')) {
        return {
            paymentMethodName: getTerm('amazon', 'payment_method'),
            paymentMethodValue: lineText,
        };
    }

    switch (props.driver.toLowerCase().substring(0, 7)) {
        // Paypal
        case 'paypal_':
            return {
                paymentMethodName: getTerm('paypal', 'payment_method'),
                paymentMethodValue: lineText,
            };
        // Venmo
        case 'venmo_b':
            return {
                paymentMethodName: getTerm('venmo', 'payment_method'),
                paymentMethodValue: lineText,
            };
        // Payment by Plugin
        case 'plugin_':
            return {
                paymentMethodName: getTerm('plugin', 'payment_method'),
                paymentMethodValue: lineText,
            };
        // Other - Branded Cards - Credit cards
        default:
            return {
                paymentMethodName: props.brand,
                paymentMethodValue: getCardDisplayFormat(props.brand, lineText),
            };
    }
}
