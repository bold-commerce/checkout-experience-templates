import {IApplicationStatePayment} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetPayments(): Array<IApplicationStatePayment> {
    return useAppSelector((state) => state.data.application_state.payments);
}
