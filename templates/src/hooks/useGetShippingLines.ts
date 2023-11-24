import {generateTaxes, shippingLines, validateShippingLine} from 'src/library';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetRequiresShipping, useGetValidVariable} from 'src/hooks';
import {actionSetAppStateValid, actionSetButtonDisable, actionSetLoader} from 'src/action';
import {IUseGetShippingLines} from 'src/types';

export function useGetShippingLines(): IUseGetShippingLines {
    const dispatch = useDispatch();
    const notValidText = getTerm('no_shipping_invalid_address_updated', Constants.SHIPPING_METHOD_INFO);
    const fieldSectionText = getTerm('shipping_method', Constants.SHIPPING_METHOD_INFO);
    const taxShippingText = getTerm('shipping_tax_notification', Constants.SHIPPING_METHOD_INFO);
    const loading = useGetLoaderScreenVariable('shippingLines');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const updatedAddress = useGetValidVariable('updatedShippingAddress');
    const requiresShipping = useGetRequiresShipping();

    useEffect(() => {
        if (isValidAddress && updatedAddress) {
            dispatch(actionSetButtonDisable('shippingPageButton', true));
            if (requiresShipping) {
                dispatch(shippingLines(updatedAddress)).then(() => {
                    dispatch(validateShippingLine);
                });
            } else {
                dispatch(generateTaxes).then(() => {
                    dispatch(actionSetButtonDisable('shippingPageButton', false));
                    dispatch(actionSetAppStateValid('shippingLine', true));
                    dispatch(actionSetLoader('shippingLines', false));
                });
            }
        } else {
            dispatch(actionSetLoader('shippingLines', false));
        }
    }, [isValidAddress, updatedAddress]);

    return {loading, isValidAddress, notValidText, fieldSectionText, taxShippingText};
}
