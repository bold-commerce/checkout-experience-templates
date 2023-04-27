import {useAppSelector} from 'src/hooks';

export function useGetValidVariable(validField: string): boolean{
    return useAppSelector((state) => state.isValid[validField]);
}

