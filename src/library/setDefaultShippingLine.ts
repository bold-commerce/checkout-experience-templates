import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {hasEmptyRequiredFields} from 'src/utils';
import {getShippingFromLib} from 'src/library/applicationState';
import {actionSetAppStateValid, actionSetSelectedShippingLine} from 'src/action';
import {postShippingLines} from 'src/library/postShippingLines';

export function setDefaultShippingLine(dispatch: Dispatch, getState: () => IOrderInitialization): void {

    dispatch(getShippingFromLib);
    const shippingLines = getState().data.application_state.shipping.available_shipping_lines;
    const selectedLine = getState().data.application_state.shipping.selected_shipping;
    const emptyRequiredFields = hasEmptyRequiredFields(['id'], {...selectedLine});

    if (shippingLines && shippingLines.length > 0) {
        dispatch(actionSetSelectedShippingLine(!emptyRequiredFields ? selectedLine : shippingLines[0]));
        dispatch(postShippingLines);
        dispatch(actionSetAppStateValid('updatedShippingAddress', false));
    }
}
