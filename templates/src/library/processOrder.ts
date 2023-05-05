import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    httpStatusCode,
    IApiReturnObject,
    processOrder as processOrderLib,
    sendHandleScaActionAsync,
} from '@boldcommerce/checkout-frontend-library';
import {checkErrorAndProceedToNextPage, getApplicationStateFromLib} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {actionSetAppStateValid, actionShowHideOverlayContent} from 'src/action';
import {getCheckoutUrl, handleErrorIfNeeded} from 'src/utils';
import {API_RETRY, Constants, errorFields, errorSubTypes} from 'src/constants';
import {useRemoveAllFlashErrors} from 'src/hooks';

export function processOrder(history: HistoryLocationState) {
    return async function processOrderThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        let {errors} = getState();
        useRemoveAllFlashErrors(dispatch, errors);
        await dispatch(actionSetAppStateValid('scaToken', false));
        errors = getState().errors;
        if (errors.length === 0) {
            const response: IApiReturnObject = await processOrderLib(API_RETRY);
            handleErrorIfNeeded(response, dispatch, getState);

            if (response.success) {
                if(response.status === httpStatusCode.ACCEPTED){
                    await dispatch(actionSetAppStateValid('scaToken', true));
                    await sendHandleScaActionAsync();
                } else {
                    await dispatch(actionSetAppStateValid('orderProcessed', true));
                    await dispatch(checkErrorAndProceedToNextPage(Constants.THANK_YOU_ROUTE, 'paymentPageButton', history, true));
                    await dispatch(getApplicationStateFromLib);
                    dispatch(actionShowHideOverlayContent(false));
                }
            } else {
                errors = getState().errors;
                const error = errors.find(error => (error.field === errorFields.inventory && error.sub_type === errorSubTypes.insufficient_stock));
                if(error){
                    history.replace(getCheckoutUrl(Constants.OUT_OF_STOCK_ROUTE));
                }
                dispatch(actionShowHideOverlayContent(false));
            }
        } else {
            dispatch(actionShowHideOverlayContent(false));
        }
    };
}
