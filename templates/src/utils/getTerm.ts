import {getLanguageBlob} from 'src/utils';
import {useAppSelector, useGetSupportedLanguageData} from 'src/hooks';

export function getTerm (term: string, section: string, languageBlob?: Array<Array<string>>, defaultTerm?: string): string {
    const backupTerm = defaultTerm ?? term;
    let blob: Array<Array<string>> | undefined | null = languageBlob;

    if (!blob) {
        const languageIso = useAppSelector((state) => state.appSetting.languageIso);
        const language = useGetSupportedLanguageData(languageIso);
        blob = getLanguageBlob(language);
    }

    return blob?.[section]?.[term] ?? backupTerm;
}
