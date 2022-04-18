import * as getLanguageBlob from 'src/utils/getLanguageBlob';
import {Constants} from 'src/constants';
import {initialDataMock} from 'src/mocks';
import * as useGetSupportedLanguageData from 'src/hooks/useGetSupportedLanguageData';
import * as useAppSelector from 'src/hooks/rootHooks';
import {getTerm} from 'src/utils';

describe('Test function getTerm', () => {
    let useAppSelectorSpy: jest.SpyInstance;
    let getLanguageBlobSpy: jest.SpyInstance;
    let useGetSupportedLanguageDataSpy: jest.SpyInstance;

    const languageIsoValueEnglish = 'en';
    const nonExistingTerm = 'term';
    const nonExistingSection = 'section';
    const existingTerm = 'complete_order';
    const existingSection = Constants.PAYMENT_INFO;
    const translatedCorrectlyByFunction = 'Complete order';
    const languageBlobParsedMock = JSON.parse(initialDataMock.initial_data.supported_languages[0].language_blob)['terms'];
    const languageBlobMock = initialDataMock.initial_data.supported_languages[0];

    const dataProviderLanguageBlobNotProvided = [
        [
            'LanguageBlob parameter is undefined - blob returned by functions is null', // Test name
            [nonExistingTerm, nonExistingSection, undefined],   // getTerm function parameters
            [1, 1, 1],               // number of time each function inside getTerm function is called
            [languageIsoValueEnglish, null, null],              // mockValue returned by each function if called inside getTerm function
            [languageIsoValueEnglish, null],                    // Parameter used to call function inside getTerm function
            nonExistingTerm                                     // expected value
        ],
        [
            'LanguageBlob parameter is undefined - blob returned by functions is complete - term does not exist',
            [nonExistingTerm, existingSection, undefined],
            [1, 1, 1],
            [languageIsoValueEnglish, languageBlobMock, languageBlobParsedMock],
            [languageIsoValueEnglish, languageBlobMock],
            nonExistingTerm
        ],
        [
            'LanguageBlob parameter is undefined - blob returned by functions is complete - section does not exist',
            [existingTerm, nonExistingSection, undefined],
            [1, 1, 1],
            [languageIsoValueEnglish, languageBlobMock, languageBlobParsedMock],
            [languageIsoValueEnglish, languageBlobMock],
            existingTerm
        ],
        [
            'LanguageBlob parameter is undefined - blob returned by functions is complete - section and term exist - string correctly translated',
            [existingTerm, existingSection, undefined],
            [1, 1, 1],
            [languageIsoValueEnglish, languageBlobMock, languageBlobParsedMock],
            [languageIsoValueEnglish, languageBlobMock],
            translatedCorrectlyByFunction
        ]
    ];
    const dataProviderLanguageBlobProvided = [
        [
            'LanguageBlob parameter is valid - term does not exist',
            [nonExistingTerm, existingSection, languageBlobParsedMock],
            nonExistingTerm
        ],
        [
            'LanguageBlob parameter is valid - section does not exist',
            [existingTerm, nonExistingSection, languageBlobParsedMock],
            existingTerm
        ],
        [
            'LanguageBlob parameter is valid - section and term do exist, text is correctly translated',
            [existingTerm, existingSection, languageBlobParsedMock],
            translatedCorrectlyByFunction
        ]
    ];

    beforeEach(() => {
        jest.resetAllMocks();

        useAppSelectorSpy = jest.spyOn(useAppSelector, 'useAppSelector');
        getLanguageBlobSpy = jest.spyOn(getLanguageBlob, 'getLanguageBlob');
        useGetSupportedLanguageDataSpy = jest.spyOn(useGetSupportedLanguageData, 'useGetSupportedLanguageData');
    });

    test.each(dataProviderLanguageBlobNotProvided)('%s', (name, getTermParameters, timesCalled, mockedValuesReturned, otherFctParameters, expectedResult) => {
        useAppSelectorSpy.mockReturnValue(mockedValuesReturned[0]);
        useGetSupportedLanguageDataSpy.mockReturnValue(mockedValuesReturned[1]);
        getLanguageBlobSpy.mockReturnValueOnce(mockedValuesReturned[2]);

        const returned = getTerm(getTermParameters[0], getTermParameters[1], getTermParameters[2]);
        expect(useAppSelectorSpy).toHaveBeenCalledTimes(timesCalled[0]);
        expect(useGetSupportedLanguageDataSpy).toHaveBeenCalledTimes(timesCalled[1]);
        expect(useGetSupportedLanguageDataSpy).toHaveBeenCalledWith(otherFctParameters[0]);
        expect(getLanguageBlobSpy).toHaveBeenCalledTimes(timesCalled[2]);
        expect(getLanguageBlobSpy).toHaveBeenCalledWith(otherFctParameters[1]);

        expect(returned).toBe(expectedResult);
    });

    test.each(dataProviderLanguageBlobProvided)('%s', (name, getTermParameters, expectedResult) => {
        const returned = getTerm(getTermParameters[0], getTermParameters[1], getTermParameters[2]);
        expect(useAppSelectorSpy).not.toHaveBeenCalled();
        expect(useGetSupportedLanguageDataSpy).not.toHaveBeenCalled();
        expect(getLanguageBlobSpy).not.toHaveBeenCalled();

        expect(returned).toBe(expectedResult);
    });
});
