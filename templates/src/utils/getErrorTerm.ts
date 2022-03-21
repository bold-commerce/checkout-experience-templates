import {useAppSelector, useGetSupportedLanguageData} from 'src/hooks';
import {getLanguageBlob} from 'src/utils';
import {Constants} from 'src/constants';

export function getErrorTerm (term: string, section: string, languageErrorBlob?: Array<Array<string>>): string {
    let blob;
    if (languageErrorBlob) {
        blob = languageErrorBlob;
    } else {
        const languageIso = useAppSelector((state) => state.appSetting.languageIso);
        const language = useGetSupportedLanguageData(languageIso);
        blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE);
    }

    if(blob && blob[section] && blob[section][term]) {
        return blob[section][term];
    } else {
        return term;
    }
}
