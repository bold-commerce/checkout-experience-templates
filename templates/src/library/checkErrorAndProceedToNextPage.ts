import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionRemoveErrorByField, actionRemoveErrorByTypeAndCode, actionSetLoaderAndDisableButton} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {getCheckoutUrl, getTotals, isOnlyDiscountCodeError} from 'src/utils';
import {errorFields, errorTypes} from 'src/constants';
import {orderCompleteAnalytics} from 'src/analytics';
import {IFees, IShippingLine} from '@boldcommerce/checkout-frontend-library';

export function checkErrorAndProceedToNextPage(
    page: string,
    loaderName: string,
    history: HistoryLocationState,
    callOrderCompleteAnalytics = false) {
    return async function checkErrorAndProceedToNextPageThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        await dispatch(actionRemoveErrorByField(`${errorFields.discounts}`));
        await dispatch(actionRemoveErrorByTypeAndCode(`${errorTypes.discount_code_validation}`, '02'));

        const {errors} = getState();
        dispatch(actionSetLoaderAndDisableButton(loaderName, false));

        if (errors.length <= 0 || isOnlyDiscountCodeError(errors)) {
            history.replace(getCheckoutUrl(page));
            if(callOrderCompleteAnalytics){
                const {public_order_id: id, application_state: appState} = getState().data;
                const discounts = appState.discounts;
                const payments = appState.payments;
                const taxes = appState.taxes;
                const shipping = appState.shipping.selected_shipping as IShippingLine;
                const lineItems = appState.line_items;
                const currency = appState.currency.iso_code;
                const fees = appState.fees as Array<IFees>;
                const orderTotal = appState.order_total;
                const totals = getTotals(lineItems, payments, taxes, fees, discounts, orderTotal);
                orderCompleteAnalytics(lineItems, currency, totals, shipping, id, discounts);
            }
        }
    };
}
