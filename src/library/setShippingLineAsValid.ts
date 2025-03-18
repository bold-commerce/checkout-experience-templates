import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    actionSetAppStateValid,
    actionSetButtonDisable,
    actionSetLoader,
} from 'src/action';
import {getSummaryStateFromLib} from 'src/library/applicationState';

export function setShippingLineAsValid(dispatch: Dispatch, getState: () => IOrderInitialization): void {
    const shippingLines = getState().data.application_state.shipping.available_shipping_lines;

    if (shippingLines && shippingLines.length > 0) {
        dispatch(actionSetAppStateValid('updatedShippingAddress', false));
        dispatch(actionSetButtonDisable('shippingPageButton', false));
        dispatch(actionSetLoader('shippingLines', false));
        dispatch(getSummaryStateFromLib);
    }
}
