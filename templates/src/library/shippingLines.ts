import {getShippingLines, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {handleErrorIfNeeded} from 'src/utils';
import {IOrderInitialization} from 'src/types';
import {actionSetButtonDisable, actionSetAppStateValid, actionSetLoader, actionSetSelectedShippingLine} from 'src/action';
import {getShippingFromLib, getSummaryStateFromLib} from 'src/library';
import {useSendEvent} from 'src/hooks';

export function shippingLines(updatedAddress: boolean) {
    return async function callShippingLines(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        dispatch(actionSetLoader('shippingLines', true));

        const response: IApiReturnObject = await getShippingLines();
        handleErrorIfNeeded(response, dispatch, getState);

        if (response.success) {
            // Beginning of sending event to back-end
            useSendEvent('CheckoutExperienceShippingLinesDisplayed');
            // of sending event to back-end

            dispatch(getShippingFromLib);
            const shippingLines = getState().data.application_state.shipping.available_shipping_lines;

            if (updatedAddress && shippingLines && shippingLines.length > 0) {
                dispatch(actionSetSelectedShippingLine(shippingLines[0]));
                dispatch(actionSetAppStateValid('updatedShippingAddress', false));
            }
            if(shippingLines && shippingLines.length > 0){
                dispatch(actionSetButtonDisable('shippingPageButton', false));
            }
            dispatch(actionSetLoader('shippingLines', false));
            await dispatch(getSummaryStateFromLib);
        }
    };
}
