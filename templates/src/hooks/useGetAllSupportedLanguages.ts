import {useAppSelector} from 'src/hooks/rootHooks';
import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';

export function useGetAllSupportedLanguages(): Array<ISupportedLanguage> {
    return useAppSelector((state) => state.data.initial_data.supported_languages);
}
