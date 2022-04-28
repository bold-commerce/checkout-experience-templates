import { useGetErrors, useGetLineItems, useGetOrderTotal, useGetShippingData, useLogin } from 'src/hooks';
import { IUseIndexPageProps } from 'src/types';
import { Constants } from 'src/constants';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {useHistory} from 'react-router';
import { displayOrderProcessingScreen, processOrder } from 'src/library';
import { sendAddPaymentActionAsync, sendRefreshOrderActionAsync } from '@bold-commerce/checkout-frontend-library';
import { getTerm } from 'src/utils';
import { sendEvents } from 'src/analytics';
import { updateLineItemQuantity } from 'src/library';
import { useGetButtonDisableVariable } from 'src/hooks';

export function useIndexPage(): IUseIndexPageProps {
    const dispatch = useDispatch();
    const history = useHistory();
    const errors = useGetErrors();
    const lineItems = useGetLineItems();
    const { email, loginUrl } = useLogin();
    const orderTotal = useGetOrderTotal();
    const address = useGetShippingData();
    const quantityDisabled = useGetButtonDisableVariable('updateLineItemQuantity');

    const loginText = getTerm('not_you', Constants.CUSTOMER_INFO);
    const summaryHeadingText =  getTerm('summary', Constants.SUMMARY_INFO);
    const shippingHeadingText = getTerm('shipping', Constants.SUMMARY_INFO);
    const paymentHeadingText = getTerm('payments', Constants.SUMMARY_INFO);

    const checkoutOnClick = useCallback(async () => {
        sendEvents('Checkout', 'Clicked complete order button');
        if (errors.length === 0) {
            dispatch(displayOrderProcessingScreen);
            if (orderTotal <= 0) {
                dispatch(processOrder(history));
            } else {
                await sendRefreshOrderActionAsync();
                await sendAddPaymentActionAsync();
            }
        }
    }, [orderTotal, history]);

    const updateLineItemQty = useCallback(async (lineItemKey: string, qty: number) => {
        await dispatch(updateLineItemQuantity(lineItemKey, qty));
    }, []);

    return {
        loginText,
        orderTotal,
        lineItems,
        summaryHeadingText,
        email,
        shippingHeadingText,
        address,
        paymentHeadingText,
        quantityDisabled,
        loginUrl,
        checkoutOnClick,
        updateLineItemQuantity: updateLineItemQty,
    };
}
