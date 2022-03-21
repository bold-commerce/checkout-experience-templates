import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetButtonDisableVariable(loader: string): boolean{
    return useAppSelector((state) => state.isButtonDisable[loader]);
}
