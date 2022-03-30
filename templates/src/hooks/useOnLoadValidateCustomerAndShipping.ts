import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useGetValidVariable} from 'src/hooks';
import {useHistory} from 'react-router';
import {validateCustomerAndShippingOnLoad} from 'src/library';

export function useOnLoadValidateCustomerAndShipping(): void {
    const dispatch = useDispatch();
    const history = useHistory();
    const isValidAddress = useGetValidVariable('shippingAddress');
    const isValidShippingLine = useGetValidVariable('shippingLine');

    useEffect(() => {
        const handleOnLoad = () => {
            if (!isValidAddress || !isValidShippingLine) {
                dispatch(validateCustomerAndShippingOnLoad(history));
            }
        };

        window.addEventListener('load', handleOnLoad);

        return () => {
            window.removeEventListener('load', handleOnLoad);
        };
    }, [isValidAddress]);
}
