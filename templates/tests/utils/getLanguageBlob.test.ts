import {getLanguageBlob} from 'src/utils';
import {Constants} from 'src/constants';
import {initialDataMock} from 'src/mocks';
import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';

describe('Test function getLanguageBlob', () => {
    let jsonParseSpy: jest.SpyInstance;

    const languageBlobMock: ISupportedLanguage = initialDataMock.initial_data.supported_languages[0];
    const languageBlobExpected = JSON.parse(languageBlobMock.language_blob);
    const languageErrorBlobExpected = {
        custom: undefined,
        ...languageBlobExpected['terms'].error_messages,
    };

    beforeEach(() => {
        jest.restoreAllMocks();
        jsonParseSpy = jest.spyOn(JSON, 'parse');
    });

    test('language parameter is null', () => {
        const returned = getLanguageBlob(null);
        expect(jsonParseSpy).not.toHaveBeenCalled();
        expect(returned).toBeNull();
    });

    test('language parameter is correctly set and returns translations', () => {
        const returned = getLanguageBlob(languageBlobMock);
        expect(jsonParseSpy).toHaveBeenCalledTimes(1);
        expect(jsonParseSpy).toHaveBeenCalledWith(languageBlobMock.language_blob);
        expect(returned).toStrictEqual(languageBlobExpected['terms']);
    });

    test('language parameter is correctly set and returns errors translations', () => {
        const returned = getLanguageBlob(languageBlobMock, Constants.LANGUAGE_BLOB_ERROR_TYPE);
        expect(jsonParseSpy).toHaveBeenCalledTimes(1);
        expect(jsonParseSpy).toHaveBeenCalledWith(languageBlobMock.language_blob);
        expect(returned).toStrictEqual(languageErrorBlobExpected);
    });
});
