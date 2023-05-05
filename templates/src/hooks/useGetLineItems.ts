import {useAppSelector} from 'src/hooks/rootHooks';
import {ILineItem} from '@boldcommerce/checkout-frontend-library';

export function useGetLineItems(): Array<ILineItem> {
    return useAppSelector((state) => state.data.application_state.line_items);
}
