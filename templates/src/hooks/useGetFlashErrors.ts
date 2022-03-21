import {useAppSelector} from 'src/hooks/rootHooks';
import {useGetErrors, useGetSupportedLanguageData} from 'src/hooks';
import {getErrorTerm, getLanguageBlob} from 'src/utils';
import {Constants, errorShowType, errorsTerms} from 'src/constants';
import {IErrorTerm} from 'src/types';

export function useGetFlashErrors(): Array<string> {
    const errors = useGetErrors();
    const result: Array<string> = [];
    const languageIso = useAppSelector((state) => state.appSetting.languageIso);
    const language = useGetSupportedLanguageData(languageIso);
    const blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;

    if (errors && errors.length > 0 ) {
        errors.forEach(error => {
            const fieldTerms: IErrorTerm | undefined = errorsTerms.find(
                e => e.type === error.type
                && e.field === error.field
                && e.severity === error.severity
                && e.subType === error.sub_type
                && e.showType === errorShowType.flash
            );
            if(fieldTerms) {
                const message = getErrorTerm(fieldTerms.term, fieldTerms.section, blob);
                result.push(message);
            }
        });
    }
    return result;
}
