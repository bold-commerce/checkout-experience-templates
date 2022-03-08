import {IApplicationStateSelectShippingLine} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetAvailableShippingLines(): Array<IApplicationStateSelectShippingLine> {
    return useAppSelector((state) => state.data.application_state.shipping.available_shipping_lines);
}
