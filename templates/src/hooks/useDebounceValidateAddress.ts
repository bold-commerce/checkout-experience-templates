import {useDebouncedCallback} from 'use-debounce';
import {validateBillingAddress, validateShippingAddress} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {Constants, debounceConstants} from 'src/constants';
import { useGetAppSettingData } from './useGetAppSettingData';

export function useDebouncedValidateAddress(type: string): DebouncedState<() => void>{
    const dispatch = useDispatch();
    const billingType = useGetAppSettingData('billingType');

    const debouncedValidateAddress = useDebouncedCallback(() => {
        if (type === Constants.SHIPPING){
            dispatch(validateShippingAddress).then(() => {
                if(billingType === Constants.SHIPPING_SAME) {
                    dispatch(validateBillingAddress);
                }
            });
        } else if (type === Constants.BILLING){
            dispatch(validateBillingAddress);
        }
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    return debouncedValidateAddress;
}




