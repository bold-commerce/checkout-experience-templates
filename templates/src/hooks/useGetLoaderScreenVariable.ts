import {useAppSelector} from 'src/hooks';

export function useGetLoaderScreenVariable(loader: string): boolean {
    return useAppSelector((state) => state.isLoading[loader]);
}

