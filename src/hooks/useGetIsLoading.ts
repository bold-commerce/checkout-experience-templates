import {useAppSelector} from 'src/hooks';

export function useGetIsLoading(): boolean {
    const isLoading = useAppSelector((state) => state.isLoading);
    for(const loader in isLoading){
        if(isLoading[loader] === true){
            return true;
        }
    }
    return false;
}
