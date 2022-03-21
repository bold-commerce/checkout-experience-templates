import {useAppSelector} from 'src/hooks/rootHooks';
import {IError} from 'src/types';

export function useGetErrors(): Array<IError>{
    return useAppSelector((state) => state.errors);
}
