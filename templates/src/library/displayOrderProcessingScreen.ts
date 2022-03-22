import {IOrderInitialization, IOverlay} from 'src/types';
import {Dispatch} from 'redux';
import {findLanguageDataByIsoCode, getLanguageBlob, getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {actionSetOverlayContent} from 'src/action';

export function displayOrderProcessingScreen(dispatch: Dispatch, getState: () => IOrderInitialization): void {
    const state = getState();
    const language = findLanguageDataByIsoCode(state.data.initial_data.supported_languages, state.appSetting.languageIso);
    if (language) {
        const languageBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_TYPE) as Array<Array<string>>;
        const headerError: string = getTerm('loading_header', Constants.CONFIRMATION_PAGE_INFO, languageBlob);
        const contentError: string = getTerm('loading_content', Constants.CONFIRMATION_PAGE_INFO, languageBlob);
        const overlay: IOverlay = {
            shown: true,
            inverted: true,
            header: headerError,
            content: contentError,
            buttonText: ''
        };
        dispatch(actionSetOverlayContent(overlay));
    } else {
        const headerError = 'Processing order... ';
        const contentError = 'This may take a few moments... Please remain on the page until the process is complete.';
        const overlay: IOverlay = {shown: true, inverted: true, header: headerError, content: contentError};
        dispatch(actionSetOverlayContent(overlay));
    }

}
