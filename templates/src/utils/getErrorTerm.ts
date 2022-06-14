import {useAppSelector, useGetSupportedLanguageData} from 'src/hooks';
import {getLanguageBlob} from 'src/utils';
import {Constants} from 'src/constants';

export function getErrorTerm (term: string, section: string, languageErrorBlob?: string[][]): string {
    let blob: string[][] | undefined | null = languageErrorBlob;

    if (!blob) {
        const languageIso = useAppSelector((state) => state.appSetting.languageIso);
        const language = useGetSupportedLanguageData(languageIso);
        blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE);
    }

    return blob?.[section]?.[term] ?? term;
}
