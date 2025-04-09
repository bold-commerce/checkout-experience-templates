import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';
import {
    ILifeField,
} from '@boldcommerce/checkout-frontend-library';
import {displayOrderProcessingScreen, processOrder, validateLifeFields} from 'src/library';
import {Dispatch} from 'redux';
import {ITotals} from 'src/types';
import {HistoryLocationState} from 'react-router';

export function callProcessOrder(dispatch: Dispatch, totals: ITotals, history: HistoryLocationState, requiredLifeFields: Array<ILifeField>, thankYouPageLifeFields?: Array<ILifeField>): void {
    sendEvents('Clicked continue to complete order button', {'category': 'Checkout'});

    dispatch(actionClearErrors());
    dispatch(validateLifeFields(requiredLifeFields, thankYouPageLifeFields));
    dispatch(displayOrderProcessingScreen);
    if (totals.totalAmountDue <= 0) {
        dispatch(processOrder(history));
    }
}

