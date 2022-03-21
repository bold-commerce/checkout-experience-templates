import {useGetDefaultSupportedLanguageIso} from 'src/hooks';
import {actionSetLanguageIso} from 'src/action/appAction';
import {useDispatch} from 'react-redux';

export function useSetDefaultLanguageIso(): void {
    const dispatch = useDispatch();
    const languages = useGetDefaultSupportedLanguageIso();
    if(languages) {
        dispatch(actionSetLanguageIso(languages));
    }
}
