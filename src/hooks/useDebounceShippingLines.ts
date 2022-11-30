import {useDebouncedCallback} from 'use-debounce';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {postShippingLines, validateShippingLine} from 'src/library';
import {debounceConstants} from 'src/constants';

export function useDebouncedShippingLines(): DebouncedState<() => void>{
    const dispatch = useDispatch();
    const debouncedShippingLines = useDebouncedCallback(() => {
        dispatch(validateShippingLine).then(() => {
            dispatch(postShippingLines);
        });
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    return debouncedShippingLines;
}