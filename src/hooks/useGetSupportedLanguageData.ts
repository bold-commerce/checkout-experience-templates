import {findLanguageDataByIsoCode} from 'src/utils';
import {useGetAllSupportedLanguages} from 'src/hooks';
import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';

export function useGetSupportedLanguageData(language_iso: string): ISupportedLanguage | null {
    const supportedLanguages = useGetAllSupportedLanguages();
    return findLanguageDataByIsoCode(supportedLanguages, language_iso);
}
