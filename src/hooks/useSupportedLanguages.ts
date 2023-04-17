import {useGetAllSupportedLanguages, useGetAppSettingData} from 'src/hooks';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {actionSetLanguageIso} from 'src/action';
import {IUseSupportedLanguages} from 'src/types';
import {updatePigiLanguage} from 'src/library';

export function useSupportedLanguages(): IUseSupportedLanguages {
    const dispatch = useDispatch();
    const supportedLanguages = useGetAllSupportedLanguages();
    const languagesOptions = supportedLanguages.map(language => ({value: language.iso_language, name: language.language_name}));
    const value = useGetAppSettingData('languageIso') as string;
    const handleChange = useCallback(async e => {
        dispatch(actionSetLanguageIso(e.target.value));
        await dispatch(updatePigiLanguage());
    }, []);

    return {languagesOptions, value , handleChange};
}
