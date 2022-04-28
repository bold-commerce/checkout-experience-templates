import { useGetAppSettingData, useGetErrors, useGetLineItems, useGetOrderTotal, useGetShippingData, useGetValidVariable, useLogin } from 'src/hooks';
import { IUseIndexPageProps } from 'src/types';
import { Constants} from 'src/constants';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {useHistory} from 'react-router';
import { displayOrderProcessingScreen, processOrder, validateBillingAddress } from 'src/library';
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
    const customBilling = useGetAppSettingData('billingType');
    const isValidBillingAddress = useGetValidVariable('billingAddress');
    //need ref to point to valid billing address for most up to date state
    const isValidBillingAddressRef = useRef<boolean>();
    isValidBillingAddressRef.current = isValidBillingAddress;

    const loginText = getTerm('not_you', Constants.CUSTOMER_INFO);
    const summaryHeadingText =  getTerm('summary', Constants.SUMMARY_INFO);
    const shippingHeadingText = getTerm('shipping', Constants.SUMMARY_INFO);
    const paymentHeadingText = getTerm('payments', Constants.SUMMARY_INFO);

    const checkoutOnClick = useCallback(async () => {
        if(customBilling === Constants.SHIPPING_DIFFERENT) {
            await dispatch(validateBillingAddress); 
        }
        //isValidBillingAddress could get updated in above dispatch call, need to use ref to fetch updated state.
        if(!isValidBillingAddressRef.current){ return; }

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
    }, [orderTotal, history, isValidBillingAddress]);

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
