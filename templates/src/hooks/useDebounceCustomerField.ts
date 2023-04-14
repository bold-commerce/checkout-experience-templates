import {useDebouncedCallback} from 'use-debounce';
import {updateCustomer} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {debounceConstants} from 'src/constants';

export function useDebounceCustomerField(): DebouncedState<() => void> {
    const dispatch = useDispatch();
    const debouncedGuestCustomer = useDebouncedCallback(async () => {
        await dispatch(updateCustomer);
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);
    return debouncedGuestCustomer;
}