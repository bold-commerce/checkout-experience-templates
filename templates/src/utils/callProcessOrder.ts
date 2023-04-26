import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';
import {
    sendAddPaymentActionAsync,
    sendClearErrorMessageAction,
} from '@bold-commerce/checkout-frontend-library';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {Dispatch} from 'redux';
import {ITotals} from 'src/types';
import {HistoryLocationState} from 'react-router';

export function callProcessOrder(dispatch: Dispatch, totals: ITotals, history: HistoryLocationState ): void {
    sendEvents('Clicked continue to complete order button', {'category': 'Checkout'});

    dispatch(actionClearErrors());
    sendClearErrorMessageAction();
    dispatch(displayOrderProcessingScreen);

    if (totals.totalAmountDue <= 0) {
        dispatch(processOrder(history));
    } else {
        sendAddPaymentActionAsync();
    }
}
