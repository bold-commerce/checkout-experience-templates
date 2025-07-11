import {
    useGetAppSettingData,
    useGetErrors,
    useGetLineItems,
    useGetOrderTotal,
    useGetShippingData,
    useGetValidVariable,
    useGetButtonDisableVariable,
    useGetCustomerInfoDataByField,
} from 'src/hooks';
import {IUseIndexPageProps} from 'src/types';
import {Constants} from 'src/constants';
import {useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {validateBillingAddress, validateShippingAddress, updateLineItemQuantity} from 'src/library';
import {callEpsProcessOrder, getTerm, getTotalsFromState} from 'src/utils';

export function useIndexPage(): IUseIndexPageProps {
    const dispatch = useDispatch();
    const history = useHistory();
    const errors = useGetErrors();
    const lineItems = useGetLineItems();
    const email = useGetCustomerInfoDataByField('email_address');
    const orderTotal = useGetOrderTotal();
    const totals = getTotalsFromState();
    const address = useGetShippingData();
    const quantityDisabled = useGetButtonDisableVariable('updateLineItemQuantity');
    const customBilling = useGetAppSettingData('billingType');
    const isValidBillingAddress = useGetValidVariable('billingAddress');
    const isValidShippingAddress = useGetValidVariable('shippingAddress');
    //need ref to point to valid billing & shipping address for most up to date state
    const isValidBillingAddressRef = useRef<boolean>();
    const isValidShippingAddressRef = useRef<boolean>();
    isValidBillingAddressRef.current = isValidBillingAddress;
    isValidShippingAddressRef.current = isValidShippingAddress;

    const loginText = getTerm('not_you', Constants.CUSTOMER_INFO);
    const summaryHeadingText = getTerm('summary', Constants.SUMMARY_INFO);
    const shippingHeadingText = getTerm('shipping', Constants.SUMMARY_INFO);
    const paymentHeadingText = getTerm('payments', Constants.SUMMARY_INFO);
    const shippingIssueText = getTerm('shipping_address_issue', Constants.CUSTOM);
    const shippingIssueLinkText = getTerm('shipping_address_issue_link', Constants.CUSTOM);

    const checkoutOnClick = useCallback(async () => {
        await dispatch(validateShippingAddress);

        if (customBilling === Constants.SHIPPING_DIFFERENT) {
            await dispatch(validateBillingAddress());
        }
        //isValidBillingAddress could get updated in above dispatch call, need to use ref to fetch updated state.
        if (!isValidShippingAddressRef.current || !isValidBillingAddressRef.current) {
            return;
        }

        if (errors.length === 0) {
            dispatch(callEpsProcessOrder(history, totals, [], []));
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
