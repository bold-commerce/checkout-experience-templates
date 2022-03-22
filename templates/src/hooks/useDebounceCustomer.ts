import {useDebouncedCallback} from 'use-debounce';
import {postGuestCustomer, updateCustomer} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {debounceConstants} from 'src/constants';
import {useGetCustomerInfoData} from 'src/hooks';

export function useDebounceCustomer(): DebouncedState<() => void>{
    const dispatch = useDispatch();
    const {platform_id: platformId} = useGetCustomerInfoData();
    const isUserLogin = (platformId != null && +platformId > 0);
    const debouncedGuestCustomer = useDebouncedCallback(async () => {
        if(isUserLogin){
            await dispatch(updateCustomer);
        } else {
            await dispatch(postGuestCustomer);
        }
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    return debouncedGuestCustomer;
}




