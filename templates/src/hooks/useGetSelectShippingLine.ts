import {useAppSelector} from 'src/hooks/rootHooks';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';

export function useGetSelectShippingLine(): IShippingLine {
    return useAppSelector((state) => state.data.application_state.shipping.selected_shipping);
}
