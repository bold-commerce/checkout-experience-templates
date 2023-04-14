import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {useCallApiAtOnEvents, useGetAppSettingData, useIsUserAuthenticated, useGetShippingData} from 'src/hooks';
import {actionRemoveErrorByAddressType, actionSetAppStateValid, actionUpdateBillingType, actionUpdateBillingTypeInSettings} from 'src/action';
import {IAddressProps, IBillingAddress} from 'src/types';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {validateBillingAddress} from 'src/library';

export function useBillingAddress(): IBillingAddress{
    const dispatch = useDispatch();
    const customBilling = useGetAppSettingData('billingType') as string;
    const isCustomerLoggedIn = useIsUserAuthenticated();
    const shippingAddress = useGetShippingData();
    const callApiAtOnEvents = useCallApiAtOnEvents();

    const handleChange = useCallback(e => {
        const billingType = e.target.value;
        dispatch(actionUpdateBillingTypeInSettings(billingType));
        dispatch(actionUpdateBillingType(billingType, shippingAddress));
        dispatch(actionRemoveErrorByAddressType(Constants.BILLING));

        if(billingType === Constants.SHIPPING_SAME && callApiAtOnEvents) {
            dispatch(validateBillingAddress);
        }
    }, []);

    const toggleBillingSameAsShipping = useCallback(() => {
        const billingType = customBilling === Constants.SHIPPING_SAME ? Constants.SHIPPING_DIFFERENT : Constants.SHIPPING_SAME;

        dispatch(actionSetAppStateValid('billingAddress', false));
        dispatch(actionUpdateBillingTypeInSettings(billingType));
        dispatch(actionUpdateBillingType(billingType, shippingAddress));

        if(billingType === Constants.SHIPPING_SAME && callApiAtOnEvents) {
            dispatch(validateBillingAddress);
        }
    }, [customBilling, shippingAddress]);

    const billingSame = getTerm('same_as_shipping',Constants.PAYMENT_INFO);
    const billingDifferent = getTerm('different_billing',Constants.PAYMENT_INFO);
    const billingTitle = getTerm('billing_address',Constants.PAYMENT_INFO);

    const addressProps: IAddressProps = {
        title: getTerm('billing_address', Constants.PAYMENT_INFO),
        type: Constants.BILLING,
        showTitle: false,
        showSavedAddresses: isCustomerLoggedIn
    };

    return {customBilling, billingTitle, billingSame, billingDifferent, handleChange, toggleBillingSameAsShipping, addressProps};
}

