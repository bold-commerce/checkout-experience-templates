import {ISupportedLanguage} from '@bold-commerce/checkout-frontend-library';


export function findLanguageDataByIsoCode(supportedLanguages: Array<ISupportedLanguage>, language_iso: string): ISupportedLanguage | null{
    if(Array.isArray(supportedLanguages) && supportedLanguages.length > 0) {
        const language = supportedLanguages.find(o => o.iso_language === language_iso);
        if(language) {
            return language;
        }
        return null;
    }
    else {
        // TODO Handle error here after implementing the error handling class
        return null;
    }
}
