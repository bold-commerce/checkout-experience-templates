import {Dispatch} from 'redux';
import {IApplicationStateSelectShippingLine, IOrderInitialization} from 'src/types';
import {actionRemoveErrorByField, actionRemoveErrorByTypeAndCode, actionSetLoaderAndDisableButton} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {getCheckoutUrl, getTotals, isOnlyDiscountCodeError} from 'src/utils';
import {errorFields, errorTypes} from 'src/constants';
import {orderCompleteAnalytics} from 'src/analytics';
import {useGetCurrencyInformation,} from 'src/hooks';

export function checkErrorAndProceedToNextPage(page: string, loaderName: string, history: HistoryLocationState, callOrderCompleteAnalytics = false) {
    return async function checkErrorAndProceedToNextPageThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        dispatch(actionRemoveErrorByField(`${errorFields.discounts}`));
        dispatch(actionRemoveErrorByTypeAndCode(`${errorTypes.discount_code_validation}`, '02'));

        const {errors} = getState();
        dispatch(actionSetLoaderAndDisableButton(loaderName, false));

        if (errors.length <= 0 || isOnlyDiscountCodeError(errors)) {
            history.replace(getCheckoutUrl(page));
            if(callOrderCompleteAnalytics){
                const appState = getState().data.application_state;
                const discounts = appState.discounts;
                const payments = appState.payments;
                const taxes = appState.taxes;
                const shipping = appState.shipping.selected_shipping as IApplicationStateSelectShippingLine;
                const lineItems = appState.line_items;
                const {currency} = useGetCurrencyInformation();
                const totals = getTotals(lineItems, payments, taxes, discounts, shipping);
                orderCompleteAnalytics(lineItems, currency, totals, shipping);
            }
        }
    };
}
