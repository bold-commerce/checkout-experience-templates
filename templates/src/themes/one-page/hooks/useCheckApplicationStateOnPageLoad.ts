import { useIsValidShippingOnLoad } from 'src/themes/one-page/hooks';
import { useGetIsSessionInitialized } from 'src/hooks';

export function useCheckApplicationStateOnPageLoad(): void {
    const isSessionInitialized = useGetIsSessionInitialized();
    if(!isSessionInitialized){
        useIsValidShippingOnLoad();
    }
            
}