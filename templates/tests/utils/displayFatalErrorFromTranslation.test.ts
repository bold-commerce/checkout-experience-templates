import {IOrderInitialization, IOverlay, ISupportedLanguage} from 'src/types';
import {Dispatch} from 'redux';
import {displayFatalErrorFromTranslation} from 'src/utils';
import * as overlayAction from 'src/action/overlayAction';
import * as findLanguageDataByIsoCode from 'src/utils/findLanguageDataByIsoCode';
import * as displayFatalError from 'src/utils/displayFatalError';
import * as getLanguageBlob from 'src/utils/getLanguageBlob';
import * as getTerm from 'src/utils/getTerm';
import * as getErrorTerm from 'src/utils/getErrorTerm';
import SpyInstance = jest.SpyInstance;
import {stateMock} from 'src/mocks/stateMock';
import {SET_OVERLAY_CONTENT} from 'src/action';
import {Constants} from 'src/constants';

describe('Test displayFatalErrorFromTranslation function', () => {
    let dispatch: Dispatch;
    let setOverlayContentSpy: SpyInstance;
    let findLanguageDataByIsoCodeSpy: SpyInstance;
    let displayFatalErrorSpy: SpyInstance;
    let getLanguageBlobSpy: SpyInstance;
    let getTermSpy: SpyInstance;
    let getErrorTermSpy: SpyInstance;
    let orderInitializationMock: IOrderInitialization;
    let languageBlob;
    let languageErrorBlob;
    let terms: Array<string>;

    beforeEach(() => {
        jest.restoreAllMocks();
        dispatch = jest.fn();
        orderInitializationMock = stateMock;
        displayFatalErrorSpy = jest.spyOn(displayFatalError, 'displayFatalError');
        setOverlayContentSpy = jest.spyOn(overlayAction, 'actionSetOverlayContent');
        getLanguageBlobSpy = jest.spyOn(getLanguageBlob,'getLanguageBlob');
        getTermSpy = jest.spyOn(getTerm,'getTerm');
        getErrorTermSpy = jest.spyOn(getErrorTerm,'getErrorTerm');
        findLanguageDataByIsoCodeSpy = jest.spyOn(findLanguageDataByIsoCode, 'findLanguageDataByIsoCode');
        languageBlob = JSON.parse(stateMock.data.initial_data.supported_languages[0].language_blob)['terms'];
        languageErrorBlob = languageBlob.error_messages;
        terms = [
            languageErrorBlob[Constants.GENERIC_ERROR_INFO]['fatal_err_header'],
            languageErrorBlob[Constants.GENERIC_ERROR_INFO]['fatal_err_subHeader'],
            languageBlob[Constants.CUSTOMER_INFO]['return_to_cart']
        ];
    });

    test('Language object does not exist', () => {
        findLanguageDataByIsoCodeSpy.mockReturnValueOnce(null);

        displayFatalErrorFromTranslation(orderInitializationMock, dispatch);

        expect(displayFatalErrorSpy).toHaveBeenCalledTimes(1);
        expect(displayFatalErrorSpy).toHaveBeenCalledWith(dispatch);
    });

    test('Language object exists', () => {
        const overlayPayload: IOverlay = {
            header: terms[0],
            content: terms[1],
            buttonText: terms[2],
            shown: true,
            inverted: false
        };
        const returnSetOverlayContentAction = {
            type: SET_OVERLAY_CONTENT,
            payload: overlayPayload
        };
        const language: ISupportedLanguage = orderInitializationMock.data.initial_data.supported_languages[0];
        setOverlayContentSpy.mockReturnValueOnce(returnSetOverlayContentAction);
        findLanguageDataByIsoCodeSpy.mockReturnValueOnce(language);
        getLanguageBlobSpy.mockReturnValueOnce(languageBlob);
        getLanguageBlobSpy.mockReturnValueOnce(languageErrorBlob);
        getErrorTermSpy.mockReturnValueOnce(terms[0]);
        getErrorTermSpy.mockReturnValueOnce(terms[1]);
        getTermSpy.mockReturnValueOnce(terms[2]);

        displayFatalErrorFromTranslation(orderInitializationMock, dispatch);

        expect(getLanguageBlobSpy).toHaveBeenCalledTimes(2);
        expect(getLanguageBlobSpy).toHaveBeenCalledWith(language, Constants.LANGUAGE_BLOB_TYPE);
        expect(getLanguageBlobSpy).toHaveBeenCalledWith(language, Constants.LANGUAGE_BLOB_ERROR_TYPE);
        expect(getErrorTermSpy).toHaveBeenCalledTimes(2);
        expect(getErrorTermSpy).toHaveBeenCalledWith('fatal_err_header', Constants.GENERIC_ERROR_INFO, languageErrorBlob);
        expect(getErrorTermSpy).toHaveBeenCalledWith('fatal_err_subHeader', Constants.GENERIC_ERROR_INFO, languageErrorBlob);
        expect(getTermSpy).toHaveBeenCalledTimes(1);
        expect(getTermSpy).toHaveBeenCalledWith('return_to_cart', Constants.CUSTOMER_INFO, languageBlob);
        expect(displayFatalErrorSpy).toHaveBeenCalledTimes(0);
        expect(setOverlayContentSpy).toHaveBeenCalledTimes(1);
        expect(setOverlayContentSpy).toHaveBeenCalledWith(overlayPayload);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(returnSetOverlayContentAction);
    });
});
