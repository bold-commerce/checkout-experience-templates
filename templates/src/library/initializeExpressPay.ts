import {Dispatch} from 'redux';
import {actionSetExpressPaymentSectionEnabled} from 'src/action';
import {initialize} from '@bold-commerce/checkout-express-pay-library';

export function initializeExpressPay(dispatch: Dispatch): void {
    const showHideExpressPaymentSection = (show: boolean) => {
        dispatch(actionSetExpressPaymentSectionEnabled(show));
    };
    initialize({showHideExpressPaymentSection});
}
