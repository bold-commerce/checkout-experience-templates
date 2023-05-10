import {Constants, defaultAddressState} from 'src/constants';
import {useDispatch} from 'react-redux';
import {compareAddresses, getTerm} from 'src/utils';
import {useGetSavedAddressOptions, useCallApiAtOnEvents, useGetAppSettingData} from 'src/hooks';
import {useCallback, useMemo} from 'react';
import {ISavedAddressHookProps} from 'src/types';
import * as CustomerActions from 'src/action/customerAction';
import {updateCustomer, validateBillingAddress, validateShippingAddress} from 'src/library';
import {actionSetAppStateValid, actionSetLoader, actionUpdateAddress} from 'src/action';
import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {useGetAddressData} from './useGetAddressData';
import {actionUpdateCustomerField} from 'src/action/customerAction';

/**
 * Makes an address into an ID used by <input /> values
 */
export const makeAddressId = (address: IAddress, index: number): string => {
    return `${index}__${address.address_line_1.toLowerCase().replace(/\s/g, '') || 'incomplete'}`;
};

export function useGetSavedAddressData(type: string): ISavedAddressHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents = useCallApiAtOnEvents();
    const label = getTerm('select_address',Constants.SHIPPING_INFO);
    const savedAddresses: Array<IAddress> = useGetSavedAddressOptions();
    const placeholder = savedAddresses.length ? getTerm('select_address', Constants.SHIPPING_INFO) : getTerm('enter_new_address', Constants.CUSTOMER_INFO);
    const title = type === Constants.SHIPPING ? getTerm('shipping_address', Constants.SHIPPING_INFO) : getTerm('billing_address',Constants.PAYMENT_INFO);
    const id = `${type}-saved-address-select`;
    const dataTestId = `${type}-saved-address-select`;
    const billingType = useGetAppSettingData('billingType');

    let count = 1;
    const options = savedAddresses.map((address , index) => ({
        value: makeAddressId(address, index),
        name: address.address_line_1 || `Incomplete address #${count++}`,
    }));
    const currentAddress = useGetAddressData(type);
    const selectedOptionId = useMemo(() => {
        if (!currentAddress) {
            return undefined;
        }
        const address = savedAddresses.find(address => compareAddresses(address, currentAddress));
        return !address ? undefined : makeAddressId(address, savedAddresses.indexOf(address));
    }, [savedAddresses, currentAddress]);

    const handleChange = useCallback(e => {
        const value = e.target.value;
        const address = savedAddresses.find((o , index) => makeAddressId(o, index) === value) || defaultAddressState;

        if (callApiAtOnEvents) {
            if (type === Constants.SHIPPING) {
                dispatch(actionSetAppStateValid('shippingAddress', false));
            } else if (type === Constants.BILLING) {
                dispatch(actionSetAppStateValid('billingAddress', false));
            }

            if (value !== 'new') {
                dispatch(actionUpdateAddress(type, address));
                dispatch(actionUpdateCustomerField(Constants.ADDRESS_FIRST_NAME, address.first_name));
                dispatch(actionUpdateCustomerField(Constants.ADDRESS_LAST_NAME, address.last_name));
                dispatch(actionSetAppStateValid('shippingAddress', true));
                dispatch(actionSetLoader('shippingLines', true));
                if (type === Constants.SHIPPING) {
                    dispatch(updateCustomer).then(() => {
                        dispatch(validateShippingAddress).then(() => {
                            if(billingType === Constants.SHIPPING_SAME) {
                                dispatch(validateBillingAddress);
                            }
                        });
                    });
                }

                if (type === Constants.BILLING) {
                    dispatch(validateBillingAddress);
                }
            }
        }

        dispatch(CustomerActions.actionPopulateSavedAddressField(type, address));
    }, [savedAddresses]);

    return {id, title, label, placeholder, options, savedAddresses, selectedOptionId , handleChange, dataTestId};

}
