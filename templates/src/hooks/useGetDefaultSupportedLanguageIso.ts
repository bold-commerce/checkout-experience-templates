import {displayFatalError} from 'src/utils';
import {useDispatch} from 'react-redux';
import {useGetAllSupportedLanguages, useGetSelectedLanguageIso} from 'src/hooks';

export function useGetDefaultSupportedLanguageIso(): string | null {
    const dispatch = useDispatch();
    const supportedLanguages = useGetAllSupportedLanguages();
    const selectedLanguage = useGetSelectedLanguageIso();
    let language;
    if(Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
        // use selected language if it is supported
        if (selectedLanguage) {
            language = supportedLanguages.find(o => o.iso_language === selectedLanguage);
        }
        // if language isn't set use default
        if (!language) {
            language = supportedLanguages.find(o => o.is_default === true) || supportedLanguages[0];
        }
        return language.iso_language;
    } else {
        displayFatalError(dispatch);
        return null;
    }
}
