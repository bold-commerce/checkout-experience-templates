import {useAppSelector} from 'src/hooks/rootHooks';
import {getErrorTerm, getLanguageBlob} from 'src/utils';
import {Constants, errorsTerms} from 'src/constants';
import {IErrorTerm} from 'src/types';
import {useGetSupportedLanguageData} from 'src/hooks';

export function useGetErrorByField(field: string, addressType = '', errorType = ''): string {
    const errors = useAppSelector((state) => state.errors);
    const error = errors.find(error => ((error.field === field || error.type === errorType) && error.address_type === addressType));
    const languageIso = useAppSelector((state) => state.appSetting.languageIso);
    const language = useGetSupportedLanguageData(languageIso);
    const blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;

    if (error) {
        const fieldTerms: IErrorTerm | undefined = errorsTerms.find(
            e => e.type === error.type
                && e.field === error.field
                && e.severity === error.severity
                && e.subType === error.sub_type
        );
        return fieldTerms ? getErrorTerm(fieldTerms.term, fieldTerms.section, blob) : error.message;
    }

    return '';
}