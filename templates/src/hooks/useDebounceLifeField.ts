import {useDebouncedCallback} from 'use-debounce';
import {patchLifeFields} from 'src/library';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {debounceConstants} from 'src/constants';

export function useDebounceLifeField(): DebouncedState<() => void> {
    const dispatch = useDispatch();

    return useDebouncedCallback(async () => {
        await dispatch(patchLifeFields);
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);
}