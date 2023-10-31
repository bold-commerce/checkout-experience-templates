import {useAppSelector} from 'src/hooks/rootHooks';
import {IDiscount} from '@boldcommerce/checkout-frontend-library';

export function useGetCombinedDiscounts(): Array<IDiscount> {
    const discounts = useAppSelector((state) => state.data.application_state.discounts);

    const combinedDiscount = new Map();

    for (const discount of discounts) {
        if (combinedDiscount.has(discount.code)) {
            combinedDiscount.get(discount.code).value += discount.value;
        } else {
            combinedDiscount.set(discount.code, Object.assign({}, discount));
        }
    }
    return [... combinedDiscount.values()];
}
