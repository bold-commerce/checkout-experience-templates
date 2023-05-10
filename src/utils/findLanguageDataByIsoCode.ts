import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';
import {logError} from 'src/utils/bugReporter';

export function findLanguageDataByIsoCode(supportedLanguages: Array<ISupportedLanguage>, language_iso: string): ISupportedLanguage | null{
    if(Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
        const language = supportedLanguages.find(o => o.iso_language === language_iso);
        if(language) {
            return language;
        }
        const error = new Error('Language not found.');
        error.name = 'LanguageError';
        logError(error, [{section: 'languages', values: {supportedLanguages, language_iso}}]);
        return null;
    } else {
        const error = new Error('No supported language provided');
        error.name = 'LanguageError';
        logError(error, [{section: 'languages', values: {supportedLanguages, language_iso}}]);
        return null;
    }
}
