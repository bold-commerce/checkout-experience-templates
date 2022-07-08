import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionRemoveErrorByField, actionRemoveErrorByTypeAndCode, actionSetLoaderAndDisableButton} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {getCheckoutUrl, getTotals, isOnlyDiscountCodeError, neuroIdSubmit, isOnlyFlashError} from 'src/utils';
import {errorFields, errorTypes} from 'src/constants';
import {orderCompleteAnalytics} from 'src/analytics';
import {IFees, IShippingLine} from '@bold-commerce/checkout-frontend-library';

export function checkErrorAndProceedToNextPage(
    page: string,
    loaderName: string,
    history: HistoryLocationState,
    callOrderCompleteAnalytics = false,
    pageNameNeuroId?: string) {
    return async function checkErrorAndProceedToNextPageThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        await dispatch(actionRemoveErrorByField(`${errorFields.discounts}`));
        await dispatch(actionRemoveErrorByTypeAndCode(`${errorTypes.discount_code_validation}`, '02'));

        const {errors} = getState();
        dispatch(actionSetLoaderAndDisableButton(loaderName, false));

        if (errors.length <= 0 || isOnlyDiscountCodeError(errors) || isOnlyFlashError(errors)) {
            if (pageNameNeuroId) {
                neuroIdSubmit(pageNameNeuroId);
            }
            history.replace(getCheckoutUrl(page));
            if(callOrderCompleteAnalytics){
                const appState = getState().data.application_state;
                const discounts = appState.discounts;
                const payments = appState.payments;
                const taxes = appState.taxes;
                const shipping = appState.shipping.selected_shipping as IShippingLine;
                const lineItems = appState.line_items;
                const currency = appState.currency.iso_code;
                const fees = appState.fees as Array<IFees>;
                const totals = getTotals(lineItems, payments, taxes, fees, discounts, shipping);
                orderCompleteAnalytics(lineItems, currency, totals, shipping);
            }
        }
    };
}
