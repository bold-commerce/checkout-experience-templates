import {displayFatalError} from 'src/utils';
import {useDispatch} from 'react-redux';
import {useGetAllSupportedLanguages} from 'src/hooks';

export function useGetDefaultSupportedLanguageIso(): string | null {
    const dispatch = useDispatch();
    const supportedLanguages = useGetAllSupportedLanguages();
    if(Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
        let language = supportedLanguages.find(o => o.is_default === true);
        if (!language) {
            language = supportedLanguages[0];
        }
        return language.iso_language;
    } else {
        displayFatalError(dispatch);
        return null;
    }
}
