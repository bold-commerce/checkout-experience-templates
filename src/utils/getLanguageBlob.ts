import {ISupportedLanguage} from 'src/types';
import {Constants} from 'src/constants';

export function getLanguageBlob(language: ISupportedLanguage | null, typeBlob?: string): Array<Array<string>> | null {
    let languageBlobParsed;
    if(language && language.language_blob && typeof language.language_blob === 'string') {
        const blob = JSON.parse(language.language_blob);
        languageBlobParsed = blob['terms'];
        return !typeBlob || typeBlob === Constants.LANGUAGE_BLOB_TYPE ? languageBlobParsed : languageBlobParsed.error_messages;
    }
    return null;
}
