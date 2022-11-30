import {Constants} from 'src/constants';

export function getClassNameByEventName(eventName: string): string {
    switch (eventName) {
        case Constants.SHIPPING_TOGGLE:
            return 'shipping';
        case Constants.TAXES_TOGGLE:
            return 'taxes';
        case Constants.PAYMENTS_TOGGLE:
            return 'payments';
        case Constants.DISCOUNTS_TOGGLE:
            return 'discounts';
        case Constants.SUBTOTAL_EVENT:
            return 'subtotal';
        case Constants.TOTAL_EVENT:
            return 'total';
        case Constants.FEES_TOGGLE:
            return 'fees';
        case Constants.AMOUNT_DUE_EVENT:
            return 'amount-due';
        default:
            return '';
    }
}
