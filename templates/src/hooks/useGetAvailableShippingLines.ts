import {useAppSelector} from 'src/hooks/rootHooks';
import {IShippingLine} from '@bold-commerce/checkout-frontend-library';

export function useGetAvailableShippingLines(): Array<IShippingLine> {
    return useAppSelector((state) => state.data.application_state.shipping.available_shipping_lines);
}
