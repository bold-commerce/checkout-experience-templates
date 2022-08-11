import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetOverlayVisible(): boolean {
    return useAppSelector((state) => state.overlay.shown);
}
