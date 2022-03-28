import {Dispatch} from 'redux';
import {changeShippingLine, IShipping, IApiReturnObject, getShipping} from '@bold-commerce/checkout-frontend-library';
import {IOrderInitialization} from 'src/types';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';
import {getSummaryStateFromLib} from 'src/library';

export async function postShippingLines(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const previousShipping: IShipping = getShipping();
    const {data: {application_state: {shipping: {selected_shipping}}}} = getState();
    const currentShipping = selected_shipping;

    if(!isObjectEquals(previousShipping.selected_shipping, currentShipping) && typeof currentShipping.id === 'string') {
        const response: IApiReturnObject = await changeShippingLine(currentShipping.id);
        handleErrorIfNeeded(response, dispatch, getState);
        await dispatch(getSummaryStateFromLib);
    }
}