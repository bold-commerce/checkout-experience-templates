import {Dispatch} from 'redux';
import {
    checkErrorAndProceedToNextPage,
    postShippingLines,
    validateShippingLine
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {Constants} from 'src/constants';

export function callShippingLinesPageApi(history: HistoryLocationState) {
    return async function callShippingLinesPageApiThunk(dispatch: Dispatch): Promise<void> {
        dispatch(actionSetLoaderAndDisableButton('shippingPageButton', true));

        await dispatch(validateShippingLine).then(() => {
            dispatch(postShippingLines).then(() => {
                dispatch(checkErrorAndProceedToNextPage(Constants.PAYMENT_ROUTE, 'shippingPageButton', history, false));
            });
        });
    };
}
