import {useAppSelector, useGetSupportedLanguageData} from 'src/hooks';
import {getLanguageBlob} from 'src/utils';
import {Constants} from 'src/constants';

export function getErrorTerm (term: string, section: string, languageErrorBlob?: Array<Array<string>>, defaultTerm?: string): string {
    const backupTerm = defaultTerm ?? term;
    let blob: Array<Array<string>> | undefined | null = languageErrorBlob;

    if (!blob) {
        const languageIso = useAppSelector((state) => state.appSetting.languageIso);
        const language = useGetSupportedLanguageData(languageIso);
        blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE);
    }

    return blob?.[section]?.[term] ?? backupTerm;
}
