import {useAppSelector} from 'src/hooks/rootHooks';
import {IIsLoading} from 'src/types';

export function useGetIsLoadingExceptSections(sections = ['pigiIframe' , 'shippingLines']): boolean {
    const isLoading: IIsLoading = useAppSelector((state) => state.isLoading);
    for(const loader in isLoading){
        if(!sections.includes(loader) && isLoading[loader] === true){
            return true;
        }
    }
    return false;
}
