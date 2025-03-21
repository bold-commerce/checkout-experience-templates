import {useDispatch} from 'react-redux';
import {IShippingLinesHookProps} from 'src/types';
import {
    useGetAvailableShippingLines,
    useGetOrderTotal,
    useGetSelectShippingLine,
    useGetCurrencyInformation
} from 'src/hooks';
import {useCallback} from 'react';
import {actionOrderTotal, actionSetSelectedShippingLine} from 'src/action';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {useGetValidVariable} from './useGetValidVariable';

export function useGetShippingLinesDataNoDebounce(): IShippingLinesHookProps {
    const dispatch = useDispatch();
    const {formattedPrice} = useGetCurrencyInformation();
    const shippingAddressValid = useGetValidVariable('shippingAddress');
    const shippingLines: Array<IShippingLine> = useGetAvailableShippingLines();
    const selectedLine: IShippingLine = useGetSelectShippingLine();
    const shippingLinesLength = shippingLines.length;
    const orderTotal = useGetOrderTotal();
    const useShippingLineCode = !shippingLines.find(line => !line.code);

    const noShippingAreaText = getTerm('no_shipping_available', Constants.SHIPPING_METHOD_INFO);

    const handleChange = useCallback(e => {
        const value = e.target.value;
        const shippingLine = shippingLines.find(o => useShippingLineCode ? o.code === value : o.id === value);
        if (shippingLine) {
            dispatch(actionSetSelectedShippingLine(shippingLine));
            dispatch(actionOrderTotal(shippingLine.amount - selectedLine.amount + orderTotal));
        }

    }, [shippingLines, useShippingLineCode]);

    return {shippingLines, selectedLine, noShippingAreaText, shippingLinesLength, handleChange, formattedPrice, shippingAddressValid, useShippingLineCode};
}
