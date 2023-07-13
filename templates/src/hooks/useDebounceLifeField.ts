import {useDebouncedCallback} from 'use-debounce';
import {patchOrderMetaData} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {debounceConstants} from 'src/constants';
import {IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';

export function useDebounceLifeField(payload: IPatchOrderMetaDataRequest): DebouncedState<() => void> {
    const dispatch = useDispatch();

    return useDebouncedCallback(async () => {
        await dispatch(patchOrderMetaData(payload));
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);
}