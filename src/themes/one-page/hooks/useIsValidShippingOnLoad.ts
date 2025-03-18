import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {hasEmptyRequiredFields} from 'src/utils';
import {actionSetAppStateValid} from 'src/action';
import {
    useGetRequiredAddressFields,
    useGetSelectShippingLine,
    useGetShippingData,
    useGetValidVariable,
} from 'src/hooks';
import {Constants} from 'src/constants';
import {isNonEmptyString} from 'src/utils/string';

export function useIsValidShippingOnLoad(): void {
    const dispatch = useDispatch();
    const shippingAddress = useGetShippingData();
    const isValidShippingAddress = useGetValidVariable('shippingAddress');
    const requiredFields = useGetRequiredAddressFields(Constants.SHIPPING);

    const emptyRequiredFields = hasEmptyRequiredFields(
        requiredFields, {...shippingAddress});

    const isShippingLineValid = useGetValidVariable('shippingLine');
    const shippingLine = useGetSelectShippingLine();

    useEffect(() => {
        if (!emptyRequiredFields) {
            if (!isValidShippingAddress) {
                dispatch(actionSetAppStateValid('shippingAddress', true));
                dispatch(actionSetAppStateValid('updatedShippingAddress', true));
            }
            if (!isShippingLineValid && isNonEmptyString(shippingLine.id)) {
                dispatch(actionSetAppStateValid('shippingLine', true));
            }
        }
    }, []);
}