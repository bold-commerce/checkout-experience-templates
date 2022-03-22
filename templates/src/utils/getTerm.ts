import {getLanguageBlob} from 'src/utils';
import {useAppSelector, useGetSupportedLanguageData} from 'src/hooks';

export function getTerm (term: string, section: string, languageBlob?: Array<Array<string>>): string {
    let blob;
    if (languageBlob) {
        blob = languageBlob;
    } else {
        const languageIso = useAppSelector((state) => state.appSetting.languageIso);
        const language = useGetSupportedLanguageData(languageIso);
        blob = getLanguageBlob(language);
    }

    if(blob && blob[section] && blob[section][term]) {
        return blob[section][term];
    } else {
        return term;
    }
}
