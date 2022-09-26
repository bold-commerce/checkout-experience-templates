import { useDispatch } from 'react-redux';
import { isObjectEmpty } from 'src/utils';
import { actionSetAppStateValid } from 'src/action';
import {
    useGetShippingData,
    useGetValidVariable
} from 'src//hooks';

export function useIsValidShippingOnLoad(): void {
    const dispatch = useDispatch();
    const shippingAddress = useGetShippingData();
    const isValidShippingAddress = useGetValidVariable('shippingAddress');

    if (!isObjectEmpty(shippingAddress) && !isValidShippingAddress) {
        dispatch(actionSetAppStateValid('shippingAddress', true));
        dispatch(actionSetAppStateValid('updatedShippingAddress', true));
    }
}