import {useDispatch} from 'react-redux';
import {
    useGetButtonDisableVariable,
    useGetDiscounts,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLineItems,
    useGetPayments,
    useGetSelectShippingLine,
    useGetTaxes
} from 'src/hooks';
import {getCheckoutUrl, getNeuroIdPageName, getTerm, getTotals, neuroIdSubmit} from 'src/utils';
import {Constants, NeuroIdConstants} from 'src/constants';
import {useCallback} from 'react';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {
    sendAddPaymentAction,
    sendClearErrorMessageAction,
    sendRefreshOrderAction
} from '@bold-commerce/checkout-frontend-library';
import {useHistory} from 'react-router';
import {IUsePaymentPage} from 'src/types';
import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';

export function usePaymentPage(): IUsePaymentPage{
    const history = useHistory();
    const dispatch = useDispatch();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl('/thank_you'));
    }
    const backLinkText = `< ${getTerm('return_to_shipping', Constants.PAYMENT_INFO)}`;
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const nextButtonDisable = useGetButtonDisableVariable('paymentPageButton');
    const discounts = useGetDiscounts();
    const payments = useGetPayments();
    const taxes = useGetTaxes();
    const shipping = useGetSelectShippingLine();
    const lineItems = useGetLineItems();
    const totals = getTotals(lineItems, payments, taxes, discounts, shipping);

    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        neuroIdSubmit(getNeuroIdPageName(NeuroIdConstants.customerPage));
        history.replace(getCheckoutUrl('/shipping_lines'));
    } , [history]);

    const nextButtonOnClick = useCallback( () => {
        const pageNameNeuroId = getNeuroIdPageName(NeuroIdConstants.paymentPage);
        sendEvents('Checkout', 'Clicked continue to complete order button');

        dispatch(actionClearErrors);
        sendClearErrorMessageAction();
        dispatch(displayOrderProcessingScreen);

        if (totals.totalAmountDue <= 0) {
            dispatch(processOrder(history, pageNameNeuroId));
        } else {
            sendRefreshOrderAction();
            sendAddPaymentAction();
        }
    },[totals, history]);

    return {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable};
}
