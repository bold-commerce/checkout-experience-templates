import {useAppSelector} from 'src/hooks/rootHooks';
import {IPayment} from '@bold-commerce/checkout-frontend-library';

export function useGetPayments(): Array<IPayment> {
    return useAppSelector((state) => state.data.application_state.payments);
}
