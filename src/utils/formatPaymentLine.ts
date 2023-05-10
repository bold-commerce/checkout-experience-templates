import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {IPayment} from '@boldcommerce/checkout-frontend-library';

export function formatPaymentLine(line: IPayment): string {

    const giftCard = getTerm('gift_card_friendly_name', Constants.PAYMENT_INFO );

    switch (line.tag) {
        case 'Credit':
            return line.friendly_brand?? line.brand?? '';
        case 'BoldGiftCard':
            return giftCard;
        default:
            return line.lineText?? '';
    }
}
