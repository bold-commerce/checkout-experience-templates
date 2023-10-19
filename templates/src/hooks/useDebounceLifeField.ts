import {useDebouncedCallback} from 'use-debounce';
import {patchLifeField} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {debounceConstants} from 'src/constants';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

export function useDebounceLifeField(noteAttributesToAdd: ICartParameters): DebouncedState<() => void> {
    const dispatch = useDispatch();

    return useDebouncedCallback(async () => {
        await dispatch(patchLifeField(noteAttributesToAdd));
    }, debounceConstants.SHORTER_DEBOUNCE_TIME);
}