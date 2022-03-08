import {IApplicationStatePayment} from 'src/types';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function formatPaymentLine(line: IApplicationStatePayment): string{

    const giftCard = getTerm('gift_card_friendly_name', Constants.PAYMENT_INFO );

    switch (line.tag) {
        case 'Credit':
            return line.friendly_brand?? line.brand;
        case 'BoldGiftCard':
            return giftCard;
        default:
            return line.lineText?? '';
    }
}
