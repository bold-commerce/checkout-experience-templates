import {getShippingLines, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {handleErrorIfNeeded, hasEmptyRequiredFields} from 'src/utils';
import {IOrderInitialization} from 'src/types';
import {actionSetButtonDisable, actionSetAppStateValid, actionSetLoader, actionSetSelectedShippingLine} from 'src/action';
import {generateTaxes, getShippingFromLib, getSummaryStateFromLib, postShippingLines} from 'src/library';
import {useSendEvent} from 'src/hooks';
import {API_RETRY} from 'src/constants';

export function shippingLines(updatedAddress: boolean) {
    return async function callShippingLines(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        dispatch(actionSetLoader('shippingLines', true));

        const response: IApiReturnObject = await getShippingLines(API_RETRY);
        handleErrorIfNeeded(response, dispatch, getState);

        if (response.success) {
            // Beginning of sending event to back-end
            useSendEvent('CheckoutExperienceShippingLinesDisplayed');
            // of sending event to back-end
            await dispatch(generateTaxes);

            dispatch(getShippingFromLib);
            const shippingLines = getState().data.application_state.shipping.available_shipping_lines;
            const selectedLine = getState().data.application_state.shipping.selected_shipping;
            const emptyRequiredFields = hasEmptyRequiredFields(['id'], {...selectedLine});
            
            if (updatedAddress && shippingLines && shippingLines.length > 0) {
                dispatch(actionSetSelectedShippingLine(!emptyRequiredFields ? selectedLine : shippingLines[0]));
                dispatch(postShippingLines);
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
