import {IApplicationStateLineItem} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetLineItems(): Array<IApplicationStateLineItem> {
    return useAppSelector((state) => state.data.application_state.line_items);
}
