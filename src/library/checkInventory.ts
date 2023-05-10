import {Dispatch} from 'redux';
import {IOrderInitialization, IOverlay} from 'src/types';
import {
    checkInventory as checkInventoryLib,
    IApiReturnObject,
    IApiSuccessResponse,
    ICheckInventoryResponse,
    IInventoryStage
} from '@boldcommerce/checkout-frontend-library';
import {getCheckoutUrl, getHook, handleErrorIfNeeded} from 'src/utils';
import {HistoryLocationState} from 'react-router';
import {actionSetOverlayContent, actionShowHideOverlayContent} from 'src/action';
import {API_RETRY, Constants} from 'src/constants';

export function checkInventory(stage: IInventoryStage, showOverlay = true) {
    return async function CheckInventoryThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        
        if(showOverlay){
            const overlay: IOverlay = {shown: true, inverted: true, header: '', content: ''};
            dispatch(actionSetOverlayContent(overlay));
        }

        const response: IApiReturnObject = await checkInventoryLib(stage, API_RETRY);
        const history: HistoryLocationState = getHook('history');
        handleErrorIfNeeded(response, dispatch, getState);

        if(response.success) {
            const {data} = response.response as IApiSuccessResponse;
            const {inventory_check} = data as ICheckInventoryResponse;
            if(inventory_check.result === Constants.OUT_OF_STOCK_FAIL) {
                history.replace(getCheckoutUrl(Constants.OUT_OF_STOCK_ROUTE));
            }
        }

        if(showOverlay){
            dispatch(actionShowHideOverlayContent(false));
        }
    };
}
