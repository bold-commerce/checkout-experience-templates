import {IOrderInitialization, IOverlay} from 'src/types';
import {actionSetOverlayContent} from 'src/action';
import {Dispatch} from 'redux';
import {
    findLanguageDataByIsoCode,
    displayFatalError,
    getLanguageBlob,
    getErrorTerm,
    getTerm,
    getReturnToCartTermAndLink
} from 'src/utils';
import {Constants} from 'src/constants';

export function displayFatalErrorFromTranslation(state: IOrderInitialization, dispatch: Dispatch): void{

    const language = findLanguageDataByIsoCode(state.data.initial_data.supported_languages, state.appSetting.languageIso);
    const {term} = getReturnToCartTermAndLink();
    if(language) {
        const languageBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_TYPE) as Array<Array<string>>;
        const languageErrorBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
        const headerError:string = getErrorTerm('fatal_err_header', Constants.GENERIC_ERROR_INFO, languageErrorBlob);
        const contentError:string = getErrorTerm('fatal_err_subHeader', Constants.GENERIC_ERROR_INFO, languageErrorBlob);
        const returnToCart:string = getTerm(term, Constants.CUSTOMER_INFO, languageBlob);
        const overlay: IOverlay = {shown: true, inverted: false, header: headerError, content: contentError, buttonText: returnToCart};
        dispatch(actionSetOverlayContent(overlay));
    } else{
        displayFatalError(dispatch);
    }
}
