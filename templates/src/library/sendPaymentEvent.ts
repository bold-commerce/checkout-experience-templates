import {Dispatch} from 'redux';
import {sendEvents} from 'src/analytics';
import {IOrderInitialization} from 'src/types';


export function sendPaymentEvent(dispatch: Dispatch, getState: () => IOrderInitialization): void {
    const {payments, line_items: items} = getState().data.application_state;
    if (payments.length > 0) {
        const payment = payments.pop();
        payment && sendEvents('add_payment_info', {
            currency: payment.currency,
            value: payment.amount,
            items,
            payment_type: payment.type,
        });
    }
}
