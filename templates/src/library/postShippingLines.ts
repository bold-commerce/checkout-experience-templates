import {Dispatch} from 'redux';
import {changeShippingLine, IShipping, IApiReturnObject, getShipping} from '@boldcommerce/checkout-frontend-library';
import {IOrderInitialization} from 'src/types';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';
import {generateTaxes, getSummaryStateFromLib} from 'src/library';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {API_RETRY} from 'src/constants';

export async function postShippingLines(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const previousShipping: IShipping = getShipping();
    const {data: {application_state: {shipping: {selected_shipping}}}} = getState();
    const {data: {initial_data: {general_settings: {checkout_process:{tax_shipping}}}}} =  getState();
    const currentShipping = selected_shipping;

    if(!isObjectEquals(previousShipping.selected_shipping, currentShipping) && typeof currentShipping.id === 'string') {
        const response: IApiReturnObject = await changeShippingLine(currentShipping.id, API_RETRY);
        handleErrorIfNeeded(response, dispatch, getState);
        if (tax_shipping && currentShipping.amount !== 0) {
            await dispatch(generateTaxes);
        }
        await dispatch(getSummaryStateFromLib);
    }

    dispatch(actionSetLoaderAndDisableButton('shippingPageButton' , false));
}
