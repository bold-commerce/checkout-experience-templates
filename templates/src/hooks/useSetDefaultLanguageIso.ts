import {useGetDefaultSupportedLanguageIso} from 'src/hooks';
import {actionSetLanguageIso} from 'src/action/appAction';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';

export function useSetDefaultLanguageIso(): void {
    const dispatch = useDispatch();
    const languages = useGetDefaultSupportedLanguageIso();
    useEffect(() => {
        if(languages) {
            dispatch(actionSetLanguageIso(languages));
        }
    }, [languages]);
}
