import {useGetAllSupportedLanguages, useGetAppSettingData} from 'src/hooks';
import {IError} from 'src/types';
import {findLanguageDataByIsoCode, getErrorTerm, getLanguageBlob} from 'src/utils';
import {Constants, errorSeverities, errorSubTypes, errorTypes, LifeFieldErrorBackupTerms} from 'src/constants';

export function useGetLifeFieldErrorMessage(term: string): IError {
    const supportedLanguages = useGetAllSupportedLanguages();
    const languageIso = useGetAppSettingData('languageIso') as string;
    const language = findLanguageDataByIsoCode(supportedLanguages, languageIso);
    let languageErrorBlob;
    if (language) {
        languageErrorBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
    }
    const backupTerm = term === 'life_element_required' ? LifeFieldErrorBackupTerms.IS_REQUIRED : LifeFieldErrorBackupTerms.IS_INVALID;
    const errorMessage = getErrorTerm(term, 'life_elements', languageErrorBlob, backupTerm);

    return {
        message: errorMessage,
        type: errorTypes.life_elements,
        field: '',
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.empty,
        address_type: '',
    };
}
