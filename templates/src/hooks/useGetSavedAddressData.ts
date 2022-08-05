import {Constants, defaultAddressState} from 'src/constants';
import {useDispatch} from 'react-redux';
import {compareAddresses, getTerm} from 'src/utils';
import {useGetSavedAddressOptions, useCallApiAtOnEvents, useGetAppSettingData} from 'src/hooks';
import {useCallback, useMemo} from 'react';
import {ISavedAddressHookProps} from 'src/types';
import * as CustomerActions from 'src/action/customerAction';
import {validateBillingAddress, validateShippingAddress} from 'src/library';
import { actionSetAppStateValid, actionUpdateAddress } from 'src/action';
import {IAddress} from '@bold-commerce/checkout-frontend-library';
import { useGetAddressData } from './useGetAddressData';

/**
 * Makes an address into an ID used by <input /> values
 */
const makeAddressId = (address: IAddress) => {
    return `${address.id}__${address.address_line_1 || 'incomplete'}`;
};

export function useGetSavedAddressData(type: string): ISavedAddressHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents = useCallApiAtOnEvents();
    const label = getTerm('select_address',Constants.SHIPPING_INFO);
    const placeholder = getTerm('enter_new_address', Constants.CUSTOMER_INFO);
    const title = type === Constants.SHIPPING ? getTerm('shipping_address', Constants.SHIPPING_INFO) : getTerm('billing_address',Constants.PAYMENT_INFO);
    const id = `${type}-saved-address-select`;
    const billingType = useGetAppSettingData('billingType');
    const savedAddresses: Array<IAddress> = useGetSavedAddressOptions();
    let count = 1;
    const options = savedAddresses.map(address => ({
        value: makeAddressId(address),
        name: address.address_line_1 || `Incomplete address #${count++}`,
    }));
    const currentAddress = useGetAddressData(type);
    const selectedOptionId = useMemo(() => {
        if (!currentAddress) { return undefined; }
        const address = savedAddresses.find(address => compareAddresses(address, currentAddress));
        return !address ? undefined : makeAddressId(address);
    }, [savedAddresses, currentAddress]);

    const handleChange = useCallback(e => {
        const value = e.target.value;
        const address = savedAddresses.find(o => makeAddressId(o) === value) || defaultAddressState;

        if (callApiAtOnEvents) {
            dispatch(actionSetAppStateValid('shippingAddress', false));
            if (value !== 'new') {
                dispatch(actionUpdateAddress(Constants.SHIPPING, address));
                dispatch(validateShippingAddress).then(() => {
                    if(billingType === Constants.SHIPPING_SAME) {
                        dispatch(validateBillingAddress);
                    }
                });
            }
        }

        dispatch(CustomerActions.actionPopulateSavedAddressField(type, address));
    }, [savedAddresses]);

    return {id, title, label, placeholder, options, savedAddresses, selectedOptionId , handleChange};

}
