import {useDebouncedCallback} from 'use-debounce';
import {validateBillingAddress, validateShippingAddress} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {Constants, debounceConstants} from 'src/constants';

export function useDebouncedValidateAddress(type: string): DebouncedState<() => void>{
    const dispatch = useDispatch();
    const debouncedValidateAddress = useDebouncedCallback(() => {
        if (type === Constants.SHIPPING){
            dispatch(validateShippingAddress);
        } else if (type === Constants.BILLING){
            dispatch(validateBillingAddress);
        }
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    return debouncedValidateAddress;
}




