import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {SET_OVERLAY_CONTENT, actionSetOverlayContent} from 'src/action';
import {Constants} from 'src/constants';
import {IOrderInitialization, IOverlay} from 'src/types';
import {
    displayFatalErrorFromTranslation,
    findLanguageDataByIsoCode,
    displayFatalError,
    getLanguageBlob,
    getTerm,
    getErrorTerm,
    getReturnToCartTermAndLink
} from 'src/utils';
import {stateMock} from 'src/mocks/stateMock';

jest.mock('src/action/overlayAction');
jest.mock('src/utils/displayFatalError');
jest.mock('src/utils/findLanguageDataByIsoCode');
jest.mock('src/utils/getErrorTerm');
jest.mock('src/utils/getLanguageBlob');
jest.mock('src/utils/getTerm');
jest.mock('src/utils/getReturnToCartTermAndLink');
const actionSetOverlayContentMock = mocked(actionSetOverlayContent, true);
const displayFatalErrorMock = mocked(displayFatalError, true);
const findLanguageDataByIsoCodeMock = mocked(findLanguageDataByIsoCode, true);
const getErrorTermMock = mocked(getErrorTerm, true);
const getLanguageBlobMock = mocked(getLanguageBlob, true);
const getTermMock = mocked(getTerm, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);

describe('Test displayFatalErrorFromTranslation function', () => {
    const orderInitializationMock: IOrderInitialization = stateMock;
    let dispatch: Dispatch;
    let languageBlob;
    let languageErrorBlob;
    let terms: Array<string>;

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch = jest.fn();
        languageBlob = JSON.parse(stateMock.data.initial_data.supported_languages[0].language_blob)['terms'];
        languageErrorBlob = languageBlob.error_messages;
        terms = [
            languageErrorBlob[Constants.GENERIC_ERROR_INFO]['fatal_err_header'],
            languageErrorBlob[Constants.GENERIC_ERROR_INFO]['fatal_err_subHeader'],
            languageBlob[Constants.CUSTOMER_INFO]['return_to_cart']
        ];
        getReturnToCartTermAndLinkMock.mockReturnValue({term: 'return_to_cart', link: 'https://test.com'});
    });

    test('Language object does not exist', () => {
        findLanguageDataByIsoCodeMock.mockReturnValueOnce(null);

        displayFatalErrorFromTranslation(orderInitializationMock, dispatch);

        expect(displayFatalErrorMock).toHaveBeenCalledTimes(1);
        expect(displayFatalErrorMock).toHaveBeenCalledWith(dispatch);
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
        actionSetOverlayContentMock.mockReturnValueOnce(returnSetOverlayContentAction);
        findLanguageDataByIsoCodeMock.mockReturnValueOnce(language);
        getLanguageBlobMock.mockReturnValueOnce(languageBlob);
        getLanguageBlobMock.mockReturnValueOnce(languageErrorBlob);
        getErrorTermMock.mockReturnValueOnce(terms[0]);
        getErrorTermMock.mockReturnValueOnce(terms[1]);
        getTermMock.mockReturnValueOnce(terms[2]);

        displayFatalErrorFromTranslation(orderInitializationMock, dispatch);

        expect(getLanguageBlobMock).toHaveBeenCalledTimes(2);
        expect(getLanguageBlobMock).toHaveBeenCalledWith(language, Constants.LANGUAGE_BLOB_TYPE);
        expect(getLanguageBlobMock).toHaveBeenCalledWith(language, Constants.LANGUAGE_BLOB_ERROR_TYPE);
        expect(getErrorTermMock).toHaveBeenCalledTimes(2);
        expect(getErrorTermMock).toHaveBeenCalledWith('fatal_err_header', Constants.GENERIC_ERROR_INFO, languageErrorBlob);
        expect(getErrorTermMock).toHaveBeenCalledWith('fatal_err_subHeader', Constants.GENERIC_ERROR_INFO, languageErrorBlob);
        expect(getTermMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledWith('return_to_cart', Constants.CUSTOMER_INFO, languageBlob);
        expect(displayFatalErrorMock).toHaveBeenCalledTimes(0);
        expect(actionSetOverlayContentMock).toHaveBeenCalledTimes(1);
        expect(actionSetOverlayContentMock).toHaveBeenCalledWith(overlayPayload);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(returnSetOverlayContentAction);
    });
});
