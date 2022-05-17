import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetCartParameters(): Record<string, string> {
    return useAppSelector((state) => state.data.application_state.order_meta_data.cart_parameters);
}
