import {useDispatch} from 'react-redux';
import {IShippingLinesHookProps} from 'src/types';
import {useGetAvailableShippingLines, useGetSelectShippingLine} from 'src/hooks';
import {useCallback} from 'react';
import {actionSetLoaderAndDisableButton, actionSetSelectedShippingLine} from 'src/action';
import {useDebouncedShippingLines, useGetCurrencyInformation} from 'src/hooks';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {useGetValidVariable} from './useGetValidVariable';

export function useGetShippingLinesData(): IShippingLinesHookProps {
    const dispatch = useDispatch();
    const {formattedPrice} = useGetCurrencyInformation();
    const shippingAddressValid = useGetValidVariable('shippingAddress');
    const shippingLines: Array<IShippingLine> = useGetAvailableShippingLines();
    const selectedLine: IShippingLine = useGetSelectShippingLine();
    const shippingLinesLength = shippingLines.length;

    const noShippingAreaText = getTerm('no_shipping_available', Constants.SHIPPING_METHOD_INFO);

    const debounceApiCall = useDebouncedShippingLines();
    const handleChange = useCallback(e => {
        const id = e.target.value;
        const shippingLine = shippingLines.find(o => o.id === id);
        if(shippingLine) {
            dispatch(actionSetLoaderAndDisableButton('shippingPageButton' , true));
            dispatch(actionSetSelectedShippingLine(shippingLine));
            dispatch(debounceApiCall);
        }
    }, []);

    return {shippingLines, selectedLine, noShippingAreaText, shippingLinesLength, handleChange, formattedPrice, shippingAddressValid};
}
