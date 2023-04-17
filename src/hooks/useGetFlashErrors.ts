import {useAppSelector} from 'src/hooks/rootHooks';
import {useGetErrors, useGetSupportedLanguageData} from 'src/hooks';
import {getErrorTerm, getLanguageBlob, logError} from 'src/utils';
import {Constants, errorsTerms} from 'src/constants';
import {IErrorTerm, IMetadata, IMetadataList, IUseGetFlashError} from 'src/types';
import {useMemo} from 'react';

export function useGetFlashErrors(type = 'flash'): Array<IUseGetFlashError> {
    const errors = useGetErrors();
    const languageIso = useAppSelector((state) => state.appSetting.languageIso);
    const language = useGetSupportedLanguageData(languageIso);
    const blob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
    return useMemo(() => {
        if (!errors?.length) {
            return []; 
        }
        return errors.reduce<IUseGetFlashError[]>((arr, error) => {
            const fieldTerms: IErrorTerm | undefined = errorsTerms.find(
                e => e.type === error.type
                && e.field === error.field
                && e.severity === error.severity
                && e.subType === error.sub_type
            );

            if(fieldTerms && fieldTerms.showType === type) {
                const message = getErrorTerm(fieldTerms.term, fieldTerms.section, blob);
                const flashError: IUseGetFlashError = {message, error};
                arr.push(flashError);
            } else {
                if(!error.field && error.message && type !== 'discountFlash'){
                    const flashError: IUseGetFlashError = {message: error.message, error};
                    arr.push(flashError);
                } else if (!fieldTerms) {
                    // bugsnag the error if not found in the translation constant.
                    const unhandledError = new Error(error.message);
                    unhandledError.name = 'UnhandledFlashError';
                    const metadata: IMetadataList = [{section: 'flash_error', values: error as unknown as IMetadata}];
                    logError(unhandledError, metadata);
                }
            }

            return arr;
        }, []);
    }, [errors]);
}
