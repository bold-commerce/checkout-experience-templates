import {getShippingLines, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {handleErrorIfNeeded} from 'src/utils';
import {IOrderInitialization} from 'src/types';
import {actionSetButtonDisable, actionSetAppStateValid, actionSetLoader, actionSetSelectedShippingLine} from 'src/action';
import {getShippingFromLib, getSummaryStateFromLib, postShippingLines} from 'src/library';

export function shippingLines(updatedAddress: boolean) {
    return async function callShippingLines(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        dispatch(actionSetLoader('shippingLines', true));

        const response: IApiReturnObject = await getShippingLines();
        handleErrorIfNeeded(response, dispatch, getState);

        if (response.success) {
            dispatch(getShippingFromLib);
            const shippingLines = getState().data.application_state.shipping.available_shipping_lines;

            if (updatedAddress && shippingLines !== undefined && shippingLines.length > 0) {
                dispatch(actionSetSelectedShippingLine(shippingLines[0]));
                await dispatch(postShippingLines); //TODO: This is to be removed once the getShippingLines endpoint is changed (CASHINT-1993)
                dispatch(actionSetAppStateValid('updatedShippingAddress', false));
            }
            if(shippingLines.length > 0){
                dispatch(actionSetButtonDisable('shippingPageButton', false));
            }
            dispatch(actionSetLoader('shippingLines', false));
            await dispatch(getSummaryStateFromLib);
        }
    };
}
