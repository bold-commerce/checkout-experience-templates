import {IOverlay} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetOverlay(): IOverlay {
    return useAppSelector((state) => state.overlay);
}
