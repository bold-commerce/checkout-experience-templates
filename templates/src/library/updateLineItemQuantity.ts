import { IOrderInitialization } from 'src/types';
import { Dispatch } from 'redux';
import { IApiReturnObject, updateLineItemQuantity as updateLineItemQuantityAPI } from '@bold-commerce/checkout-frontend-library';
import { actionSetLoaderAndDisableButton } from 'src/action';
import { handleErrorIfNeeded } from 'src/utils';
import { getApplicationStateFromLib } from 'src/library';

export const updateLineItemQuantity = (lineItemKey: string, quantity: number) => async (dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> => {
    try {
        dispatch(actionSetLoaderAndDisableButton('updateLineItemQuantity', true));

        const response: IApiReturnObject = await updateLineItemQuantityAPI(lineItemKey, quantity);
        handleErrorIfNeeded(response, dispatch, getState);
        await dispatch(getApplicationStateFromLib);
        
    } finally {
        dispatch(actionSetLoaderAndDisableButton('updateLineItemQuantity', false));
    }
};
