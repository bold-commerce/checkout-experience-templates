import {IApplicationStateSelectShippingLine} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetSelectShippingLine(): IApplicationStateSelectShippingLine {
    return useAppSelector((state) => state.data.application_state.shipping.selected_shipping);
}
