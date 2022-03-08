import {Constants, defaultAddressState} from 'src/constants';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {useGetSavedAddressOptions} from 'src/hooks';
import {IAddress, ISavedAddressHookProps} from 'src/types';
import {useCallback} from 'react';
import * as CustomerActions from 'src/action/customerAction';

export function useGetSavedAddressData(type: string): ISavedAddressHookProps {
    const dispatch = useDispatch();
    const label = getTerm('select_address',Constants.SHIPPING_INFO);
    const placeholder = getTerm('enter_new_address', Constants.CUSTOMER_INFO);
    const id = `${type}-saved-address-select`;
    const savedAddresses: Array<IAddress> = useGetSavedAddressOptions();
    const options = savedAddresses.map(address => ({ value: '' + address.address_line_1, name: address.address_line_1 }));

    const handleChange = useCallback(e => {
        const value = e.target.value;
        let address = savedAddresses.find(o => o.address_line_1 === value);
        if(!address){
            address = defaultAddressState;
        }
        dispatch(CustomerActions.actionPopulateSavedAddressField(type, address));
    }, [savedAddresses]);

    return {id, label, placeholder, options, handleChange};

}
