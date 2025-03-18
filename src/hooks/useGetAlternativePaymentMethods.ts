import {IAlternativePaymentMethod} from '@boldcommerce/checkout-frontend-library';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetAlternativePaymentMethods(): IAlternativePaymentMethod {
    return useAppSelector((state) =>  state.data.initial_data.alternative_payment_methods);
}
