import {Dispatch} from 'redux';
import {IOrderInitialization, IOverlay} from 'src/types';
import {
    checkInventory as checkInventoryLib,
    IApiReturnObject,
    IApiSuccessResponse,
    ICheckInventoryResponse,
    IInventoryStage
} from '@bold-commerce/checkout-frontend-library';
import {getCheckoutUrl, getHook, handleErrorIfNeeded} from 'src/utils';
import {HistoryLocationState} from 'react-router';
import {actionSetOverlayContent, actionShowHideOverlayContent} from 'src/action';
import {Constants} from 'src/constants';

export function checkInventory(stage: IInventoryStage) {
    return async function CheckInventoryThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {

        const overlay: IOverlay = {shown: true, inverted: true, header: '', content: ''};
        dispatch(actionSetOverlayContent(overlay));

        const response: IApiReturnObject = await checkInventoryLib(stage);
        const history: HistoryLocationState = getHook('history');
        handleErrorIfNeeded(response, dispatch, getState);

        if(response.success) {
            const {data} = response.response as IApiSuccessResponse;
            const {inventory_check} = data as ICheckInventoryResponse;
            if(inventory_check.result === Constants.OUT_OF_STOCK_FAIL) {
                history.replace(getCheckoutUrl('/out_of_stock'));
            }
        }
        dispatch(actionShowHideOverlayContent(false));
    };
}
