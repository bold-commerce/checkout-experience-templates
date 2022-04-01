import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {useHistory} from 'react-router';
import {validateCustomerOnLoad} from 'src/library';

export function useOnLoadValidateCustomer(): void {
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useGetLoaderScreenVariable('shippingLines');
    const isValidAddress = useGetValidVariable('shippingAddress');

    useEffect(() => {
        if (!isValidAddress && !loading) {
            dispatch(validateCustomerOnLoad(history));
        }
    }, []);
}
