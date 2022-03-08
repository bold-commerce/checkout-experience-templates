import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {useGetAppSettingData, useIsUserAuthenticated} from 'src/hooks';
import {actionRemoveErrorByAddressType, actionUpdateBillingType, actionUpdateBillingTypeInSettings} from 'src/action';
import {IAddressProps, IBillingAddress} from 'src/types';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function useBillingAddress(): IBillingAddress{
    const dispatch = useDispatch();
    const customBilling = useGetAppSettingData('billingType');
    const isCustomerLoggedIn = useIsUserAuthenticated();

    const handleChange = useCallback(e => {
        const value = e.target.value;
        dispatch(actionUpdateBillingTypeInSettings(value));
        dispatch(actionUpdateBillingType(value));
        dispatch(actionRemoveErrorByAddressType(Constants.BILLING));
    }, []);

    const billingSame = getTerm('same_as_shipping',Constants.PAYMENT_INFO);
    const billingDifferent = getTerm('different_billing',Constants.PAYMENT_INFO);
    const billingTitle = getTerm('billing_address',Constants.PAYMENT_INFO);

    const addressProps: IAddressProps = {
        title: getTerm('billing_address', Constants.PAYMENT_INFO),
        type: Constants.BILLING,
        showTitle: false,
        showSavedAddresses: isCustomerLoggedIn
    };

    return {customBilling, billingTitle, billingSame, billingDifferent, handleChange, addressProps};
}

