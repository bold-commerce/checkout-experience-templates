import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import { getShippingFromLib, postShippingLines, validateShippingLine } from 'src/library';
import { actionSetSelectedShippingLine } from 'src/action';
import { getShippingLines, IApiReturnObject } from '@bold-commerce/checkout-frontend-library';
import { handleErrorIfNeeded } from 'src/utils';

export async function setDefaultShippingLines(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const response: IApiReturnObject = await getShippingLines();
    handleErrorIfNeeded(response, dispatch, getState);

    if (response.success) {
        await dispatch(getShippingFromLib);
        const { data: {application_state: {shipping: {available_shipping_lines: shippingLines}}}} = getState();

        if (shippingLines && shippingLines.length > 0) {
            dispatch(actionSetSelectedShippingLine(shippingLines[0]));
            await dispatch(validateShippingLine).then(() => {
                dispatch(postShippingLines);
            });
        }
    }
}
