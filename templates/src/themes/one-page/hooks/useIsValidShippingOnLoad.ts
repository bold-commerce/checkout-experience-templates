import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {hasEmptyRequiredFields} from 'src/utils';
import {actionSetAppStateValid} from 'src/action';
import {
    useGetRequiredAddressFields,
    useGetShippingData,
    useGetValidVariable,
} from 'src//hooks';
import {Constants} from 'src/constants';

export function useIsValidShippingOnLoad(): void {
    const dispatch = useDispatch();
    const shippingAddress = useGetShippingData();
    const isValidShippingAddress = useGetValidVariable('shippingAddress');
    const requiredFields = useGetRequiredAddressFields(Constants.SHIPPING);

    const emptyRequiredFields = hasEmptyRequiredFields(
        requiredFields, {...shippingAddress});

    useEffect(() => {
        if (!emptyRequiredFields && !isValidShippingAddress) {
            dispatch(actionSetAppStateValid('shippingAddress', true));
            dispatch(actionSetAppStateValid('updatedShippingAddress', true));
        }
    }, []);
}