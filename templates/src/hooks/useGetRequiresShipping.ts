import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetRequiresShipping(): boolean{
    return useAppSelector((state) => state.data.initial_data.requires_shipping);
}
