import {useDispatch} from 'react-redux';
import {IApplicationStateSelectShippingLine, IShippingLinesHookProps} from 'src/types';
import {useCallApiAtOnEvents, useGetAvailableShippingLines, useGetSelectShippingLine} from 'src/hooks';
import {useCallback} from 'react';
import {actionSetSelectedShippingLine} from 'src/action';
import {useDebouncedShippingLines} from 'src/hooks';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

export function useGetShippingLinesData(): IShippingLinesHookProps{
    const dispatch = useDispatch();
    const shippingLines: Array<IApplicationStateSelectShippingLine> = useGetAvailableShippingLines();
    const selectedLine: IApplicationStateSelectShippingLine = useGetSelectShippingLine();
    const shippingLinesLength = shippingLines.length;

    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const noShippingAreaText = getTerm('no_shipping_available', Constants.SHIPPING_METHOD_INFO);

    const debounceApiCall = useDebouncedShippingLines();
    const handleChange = useCallback(e => {
        const id = e.target.value;
        const shippingLine = shippingLines.find(o => o.id === id);
        if(shippingLine) {
            dispatch(actionSetSelectedShippingLine(shippingLine));

            if(callApiAtOnEvents) {
                dispatch(debounceApiCall);
            }
        }
    }, []);

    return {shippingLines, selectedLine, noShippingAreaText, shippingLinesLength, handleChange};
}
