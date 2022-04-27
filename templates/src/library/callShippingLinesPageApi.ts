import {Dispatch} from 'redux';
import {
    checkErrorAndProceedToNextPage,
    postShippingLines,
    validateShippingLine
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';

export function callShippingLinesPageApi(history: HistoryLocationState, pageNameNeuroId?: string) {
    return async function callShippingLinesPageApiThunk(dispatch: Dispatch): Promise<void> {
        dispatch(actionSetLoaderAndDisableButton('shippingPageButton', true));

        await dispatch(validateShippingLine).then(() => {
            dispatch(postShippingLines).then(() => {
                dispatch(checkErrorAndProceedToNextPage('/payment', 'shippingPageButton', history, false, pageNameNeuroId));
            });
        });
    };
}
