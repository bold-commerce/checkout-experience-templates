import {useDispatch} from 'react-redux';
import {
    useGetButtonDisableVariable,
    useGetDiscounts,
    useGetErrors,
    useGetIsLoading,
    useGetLineItems,
    useGetPayments,
    useGetSelectShippingLine,
    useGetTaxes
} from 'src/hooks';
import {getCheckoutUrl, getTerm, getTotals} from 'src/utils';
import {Constants} from 'src/constants';
import {useCallback} from 'react';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {sendAddPaymentAction, sendRefreshOrderAction} from '@bold-commerce/checkout-frontend-library';
import {useHistory} from 'react-router';
import {IUsePaymentPage} from 'src/types';
import {sendEvents} from 'src/analytics';

export function usePaymentPage(): IUsePaymentPage{
    const history = useHistory();
    const dispatch = useDispatch();
    const errors = useGetErrors();
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
        history.replace(getCheckoutUrl('/shipping_lines'));
    } , [history]);

    const nextButtonOnClick = useCallback(async () => {
        sendEvents('Checkout', 'Clicked continue to complete order button');
        if (errors.length === 0) {
            dispatch(displayOrderProcessingScreen);
            if (totals.totalAmountDue <= 0) {
                dispatch(processOrder(history));
            } else {
                sendRefreshOrderAction();
                sendAddPaymentAction();
            }
        }
    },[totals, history]);

    return {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable};
}
