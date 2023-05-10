import {useAppSelector} from 'src/hooks/rootHooks';
import {IPayment} from '@boldcommerce/checkout-frontend-library';

export function useGetPayments(): Array<IPayment> {
    return useAppSelector((state) => state.data.application_state.payments);
}
