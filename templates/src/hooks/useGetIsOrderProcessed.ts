import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetIsOrderProcessed(): boolean{
    return useAppSelector((state) => state.data.application_state.is_processed);
}
