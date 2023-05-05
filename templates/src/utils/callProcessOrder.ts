import {sendEvents} from 'src/analytics';
import {actionAddError, actionClearErrors, actionShowHideOverlayContent} from 'src/action';
import {
    IApiErrorResponse,
    IApiReturnObject,
    sendAddPaymentActionAsync,
    sendClearErrorMessageAction,
    sendRefreshOrderActionAsync
} from '@boldcommerce/checkout-frontend-library';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {retrieveErrorFromResponse} from 'src/utils/retrieveErrorFromResponse';
import {isOnlyFlashError} from 'src/utils/isOnlyFlashError';
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
        sendRefreshOrderActionAsync().then(
            sendAddPaymentActionAsync,
            (e) => {
                const error = retrieveErrorFromResponse(<IApiReturnObject>{error: e}) as IApiErrorResponse;
                if (error && isOnlyFlashError([error])) {
                    dispatch(actionAddError(error));
                }
                dispatch(actionShowHideOverlayContent(false));
            }
        );
    }
}

