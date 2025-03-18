import {useDebouncedCallback} from 'use-debounce';
import {useDispatch} from 'react-redux';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {postShippingLines, validateShippingLine} from 'src/library';
import {debounceConstants} from 'src/constants';
import {useGetValidVariable} from 'src/hooks/useGetValidVariable';
import {sendRefreshOrderAction} from '@boldcommerce/checkout-frontend-library';
import {useGetEpsGateways} from 'src/hooks';

export function useDebouncedShippingLines(): DebouncedState<() => void>{
    const dispatch = useDispatch();
    const isValidPigi = useGetValidVariable('pigi');
    const hasEpsGateways = useGetEpsGateways();
    const debouncedShippingLines = useDebouncedCallback(() => {
        return dispatch(validateShippingLine).then(() => {
            return dispatch(postShippingLines).then(() => {
                if (isValidPigi && !hasEpsGateways) {
                    sendRefreshOrderAction();
                }
            });
        });
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    return debouncedShippingLines;
}