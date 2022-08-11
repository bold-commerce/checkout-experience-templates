import {useAppSelector} from 'src/hooks';

export function useGetIsSessionInitialized(): boolean {
    return useAppSelector((state) => state.isSessionInitialized);
}
