import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetOrderTotal(): number {
    return useAppSelector((state) => state.data.application_state.order_total);
}
