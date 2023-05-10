import {useGetAppSettingData, useGetErrors, useGetLineItems, useGetOrderTotal, useGetShippingData, useGetValidVariable, useGetButtonDisableVariable, useGetCustomerInfoDataByField} from 'src/hooks';
import {IUseIndexPageProps} from 'src/types';
import {Constants} from 'src/constants';
import {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {displayOrderProcessingScreen, processOrder, validateBillingAddress, updateLineItemQuantity} from 'src/library';
import {IApiErrorResponse, IApiReturnObject, sendAddPaymentActionAsync, sendRefreshOrderActionAsync} from '@boldcommerce/checkout-frontend-library';
import {getTerm, isOnlyFlashError, retrieveErrorFromResponse} from 'src/utils';
import {sendEvents} from 'src/analytics';
import {actionAddError, actionShowHideOverlayContent} from 'src/action';

export function useIndexPage(): IUseIndexPageProps {
    const dispatch = useDispatch();
    const history = useHistory();
    const errors = useGetErrors();
    const lineItems = useGetLineItems();
    const email = useGetCustomerInfoDataByField('email_address');
    const orderTotal = useGetOrderTotal();
    const address = useGetShippingData();
    const quantityDisabled = useGetButtonDisableVariable('updateLineItemQuantity');
    const customBilling = useGetAppSettingData('billingType');
    const isValidBillingAddress = useGetValidVariable('billingAddress');
    //need ref to point to valid billing address for most up to date state
    const isValidBillingAddressRef = useRef<boolean>();
    isValidBillingAddressRef.current = isValidBillingAddress;

    const loginText = getTerm('not_you', Constants.CUSTOMER_INFO);
    const summaryHeadingText = getTerm('summary', Constants.SUMMARY_INFO);
    const shippingHeadingText = getTerm('shipping', Constants.SUMMARY_INFO);
    const paymentHeadingText = getTerm('payments', Constants.SUMMARY_INFO);
    const shippingIssueText = getTerm('shipping_address_issue', Constants.CUSTOM);
    const shippingIssueLinkText = getTerm('shipping_address_issue_link', Constants.CUSTOM);

    const checkoutOnClick = useCallback(async () => {
        if (customBilling === Constants.SHIPPING_DIFFERENT) {
            await dispatch(validateBillingAddress);
        }
        //isValidBillingAddress could get updated in above dispatch call, need to use ref to fetch updated state.
        if (!isValidBillingAddressRef.current) {
            return;
        }

        sendEvents('Clicked complete order button', {'category': 'Checkout'});
        if (errors.length === 0) {
            dispatch(displayOrderProcessingScreen);
            if (orderTotal <= 0) {
                dispatch(processOrder(history));
            } else {
                sendRefreshOrderActionAsync().then(
                    sendAddPaymentActionAsync,
                    (e) => {
                        const error = retrieveErrorFromResponse(<IApiReturnObject>{error: e}) as IApiErrorResponse;
                        if (error && isOnlyFlashError([error])) {
                            dispatch(actionAddError(error));
                        }
                        dispatch(actionShowHideOverlayContent(false));
                    }
                );
            }
        }
    }, [orderTotal, history, isValidBillingAddress, errors]);

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
        shippingIssueText,
        shippingIssueLinkText,
        checkoutOnClick,
        updateLineItemQuantity: updateLineItemQty,
    };
}
