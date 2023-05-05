import {useAppSelector} from 'src/hooks/rootHooks';
import {IDiscount} from '@boldcommerce/checkout-frontend-library';

export function useGetDiscounts(): Array<IDiscount> {
    return useAppSelector((state) => state.data.application_state.discounts);
}
