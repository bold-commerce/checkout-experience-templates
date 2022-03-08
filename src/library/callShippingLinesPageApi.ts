import {Dispatch} from 'redux';
import {
    checkErrorAndProceedToNextPage,
    postShippingLines
} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetLoaderAndDisableButton} from 'src/action';

export function callShippingPageApi(history: HistoryLocationState) {
    return async function callShippingPageApiThunk(dispatch: Dispatch): Promise<void> {
        dispatch(actionSetLoaderAndDisableButton('shippingPageButton', true));

        dispatch(postShippingLines).then(() => {
            dispatch(checkErrorAndProceedToNextPage('/payment', 'shippingPageButton', history));
        });
    };
}
