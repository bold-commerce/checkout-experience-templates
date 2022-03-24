import {useAppSelector} from 'src/hooks/rootHooks';
import {useGetErrors, useGetSupportedLanguageData} from 'src/hooks';
import {getErrorTerm, getLanguageBlob} from 'src/utils';
import {Constants, errorShowType, errorsTerms} from 'src/constants';
import {IErrorTerm} from 'src/types';
import { useMemo } from 'react';

export function useGetFlashErrors(): Array<string> {
    const errors = useGetErrors();
    const languageIso = useAppSelector((state) => state.appSetting.languageIso);
    const language = useGetSupportedLanguageData(languageIso);
    const blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
    return useMemo(() => {
        if (!errors?.length) { return []; }
        return errors.reduce<string[]>((arr, error) => {
            const fieldTerms: IErrorTerm | undefined = errorsTerms.find(
                e => e.type === error.type
                && e.field === error.field
                && e.severity === error.severity
                && e.subType === error.sub_type
                && e.showType === errorShowType.flash
            );

            if(fieldTerms) {
                const message = getErrorTerm(fieldTerms.term, fieldTerms.section, blob);
                arr.push(message);
            }

            return arr;
        }, []);
    }, [errors]);
}
