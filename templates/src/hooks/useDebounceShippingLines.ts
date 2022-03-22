import {useDebouncedCallback} from 'use-debounce';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {postShippingLines} from 'src/library/postShippingLines';
import {debounceConstants} from 'src/constants';

export function useDebouncedShippingLines(): DebouncedState<() => void>{
    const dispatch = useDispatch();
    const debouncedShippingLines = useDebouncedCallback(() => {
        dispatch(postShippingLines);
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    return debouncedShippingLines;
}