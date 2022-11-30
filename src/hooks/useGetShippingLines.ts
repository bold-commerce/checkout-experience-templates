import {shippingLines, validateShippingLine} from 'src/library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {actionSetButtonDisable} from 'src/action';
import {IUseGetShippingLines} from 'src/types';

export function useGetShippingLines(): IUseGetShippingLines {
    const dispatch = useDispatch();
    const notValidText = getTerm('no_shipping_invalid_address_updated', Constants.SHIPPING_METHOD_INFO);
    const fieldSectionText = getTerm('shipping_method', Constants.SHIPPING_METHOD_INFO);
    const loading = useGetLoaderScreenVariable('shippingLines');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const updatedAddress = useGetValidVariable('updatedShippingAddress');

    useEffect(() => {
        if(isValidAddress && updatedAddress){
            dispatch(actionSetButtonDisable('shippingPageButton', true));
            dispatch(shippingLines(updatedAddress)).then(() => {
                dispatch(validateShippingLine);
            });
            
        }
    }, [isValidAddress, updatedAddress]);

    return {loading, isValidAddress, notValidText, fieldSectionText};
}
