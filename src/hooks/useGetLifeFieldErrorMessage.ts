import {useGetAllSupportedLanguages, useGetAppSettingData} from 'src/hooks';
import {IError} from 'src/types';
import {findLanguageDataByIsoCode, getErrorTerm, getLanguageBlob} from 'src/utils';
import {Constants, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';

export function useGetLifeFieldErrorMessage(term: string): IError {
    const supportedLanguages = useGetAllSupportedLanguages();
    const languageIso = useGetAppSettingData('languageIso') as string;
    const language = findLanguageDataByIsoCode(supportedLanguages, languageIso);
    let languageErrorBlob;
    if (language) {
        languageErrorBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
    }
    const errorMessage = getErrorTerm(term, 'life_elements', languageErrorBlob);

    return {
        message: errorMessage,
        type: errorTypes.life_elements,
        field: '',
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.empty,
        address_type: '',
    };
}
