import {Constants, defaultAddressState} from 'src/constants';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {useGetSavedAddressOptions, useCallApiAtOnEvents} from 'src/hooks';
import {IAddress, ISavedAddressHookProps} from 'src/types';
import {useCallback} from 'react';
import * as CustomerActions from 'src/action/customerAction';
import { validateShippingAddress } from 'src/library';
import { actionSetAppStateValid, actionUpdateAddress } from 'src/action';

export function useGetSavedAddressData(type: string): ISavedAddressHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents = useCallApiAtOnEvents();
    const label = getTerm('select_address',Constants.SHIPPING_INFO);
    const placeholder = getTerm('enter_new_address', Constants.CUSTOMER_INFO);
    const title = type === Constants.SHIPPING ? getTerm('shipping_address',Constants.SHIPPING_INFO) : getTerm('billing_address',Constants.PAYMENT_INFO);
    const id = `${type}-saved-address-select`;
    const savedAddresses: Array<IAddress> = useGetSavedAddressOptions();
    const options = savedAddresses.map(address => ({ value: '' + address.address_line_1, name: address.address_line_1 }));

    const handleChange = useCallback(e => {
        const value = e.target.value;
        let address = savedAddresses.find(o => o.address_line_1 === value);
        if(!address){
            address = defaultAddressState;
        }

        if (callApiAtOnEvents) {
            if (value === 'new') {
                dispatch(actionSetAppStateValid('shippingAddress', false));
            } else {
                dispatch(actionUpdateAddress(Constants.SHIPPING, address));
                dispatch(validateShippingAddress);
            }
        }

        dispatch(CustomerActions.actionPopulateSavedAddressField(type, address));

    }, [savedAddresses]);

    return {id, title, label, placeholder, options, savedAddresses, handleChange};

}
