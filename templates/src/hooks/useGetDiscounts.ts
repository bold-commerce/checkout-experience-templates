import {IApplicationStateDiscount} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetDiscounts(): Array<IApplicationStateDiscount> {
    return useAppSelector((state) => state.data.application_state.discounts);
}
