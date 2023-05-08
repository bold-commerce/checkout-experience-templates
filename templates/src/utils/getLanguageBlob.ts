import {Constants} from 'src/constants';
import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';

export function getLanguageBlob(language: ISupportedLanguage | null, typeBlob?: string): string[][] | null {
    if (typeof language?.language_blob !== 'string') {
        return null;
    }

    const blob = JSON.parse(language.language_blob);
    const languageBlobParsed = blob['terms'];

    if (typeBlob === Constants.LANGUAGE_BLOB_ERROR_TYPE) {
        return {
            custom: languageBlobParsed.custom,
            ...languageBlobParsed.error_messages,
        };
    }

    return languageBlobParsed;
}
