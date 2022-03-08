import {shippingLines} from 'src/library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {actionSetButtonDisable} from 'src/action';

export function useGetShippingLines(): { loading: boolean, isValidAddress: boolean, notValidText: string, fieldSectionText: string } {
    const dispatch = useDispatch();
    const notValidText = getTerm('no_shipping_invalid_address', Constants.SHIPPING_METHOD_INFO);
    const fieldSectionText = getTerm('shipping_method', Constants.SHIPPING_METHOD_INFO);
    const loading = useGetLoaderScreenVariable('shippingLines');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const updatedAddress = useGetValidVariable('updatedShippingAddress');

    useEffect(() => {
        if(isValidAddress && updatedAddress){
            dispatch(actionSetButtonDisable('shippingPageButton', true));
            dispatch(shippingLines(updatedAddress));
        }
    }, [isValidAddress, updatedAddress]);

    return {loading, isValidAddress, notValidText, fieldSectionText};
}
