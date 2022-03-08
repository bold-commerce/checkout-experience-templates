import {Constants} from 'src/constants';
import {initialDataMock, stateMock} from 'src/mocks';
import {getErrorTerm, getLanguageBlob} from 'src/utils';
import {mocked} from 'ts-jest/utils';
import {useGetSupportedLanguageData} from 'src/hooks';

const store = stateMock;
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));
jest.mock('src/utils/getLanguageBlob');
jest.mock('src/hooks/useGetSupportedLanguageData');
const getLanguageBlobMock = mocked(getLanguageBlob, true);
const useGetSupportedLanguageDataMock = mocked(useGetSupportedLanguageData, true);

describe('Test function getErrorTerm', () => {
    const englishIso = 'en';
    const nonExistingTerm = 'term';
    const nonExistingSection = 'section';
    const existingTerm = 'fatal_err_header';
    const existingSection = Constants.GENERIC_ERROR_INFO;
    const translatedCorrectlyByFunction = 'Looks like something went wrong...';
    const languageBlobParsedMock = JSON.parse(initialDataMock.initial_data.supported_languages[0].language_blob)['terms'].error_messages;
    const languageBlobMock = initialDataMock.initial_data.supported_languages[0];

    const dataProviderLanguageBlobNotProvided = [
        [
            'LanguageBlob parameter is undefined - blob returned by functions is null', // Test name
            [nonExistingTerm, nonExistingSection, undefined],   // getTerm function parameters
            [1, 1, 1],               // number of time each function inside getTerm function is called
            [englishIso, null, null],              // mockValue returned by each function if called inside getTerm function
            [englishIso, [null, Constants.LANGUAGE_BLOB_ERROR_TYPE]],                    // Parameter used to call function inside getTerm function
            nonExistingTerm                                     // expected value
        ],
        [
            'LanguageBlob parameter is undefined - blob returned by functions is complete - term does not exist',
            [nonExistingTerm, existingSection, undefined],
            [1, 1, 1],
            [englishIso, languageBlobMock, languageBlobParsedMock],
            [englishIso, [languageBlobMock, Constants.LANGUAGE_BLOB_ERROR_TYPE]],
            nonExistingTerm
        ],
        [
            'LanguageBlob parameter is undefined - blob returned by functions is complete - section does not exist',
            [existingTerm, nonExistingSection, undefined],
            [1, 1, 1],
            [englishIso, languageBlobMock, languageBlobParsedMock],
            [englishIso, [languageBlobMock, Constants.LANGUAGE_BLOB_ERROR_TYPE]],
            existingTerm
        ],
        [
            'LanguageBlob parameter is undefined - blob returned by functions is complete - section and term exist - string correctly translated',
            [existingTerm, existingSection, undefined],
            [1, 1, 1],
            [englishIso, languageBlobMock, languageBlobParsedMock],
            [englishIso, [languageBlobMock, Constants.LANGUAGE_BLOB_ERROR_TYPE]],
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
        jest.clearAllMocks();
    });

    test.each(dataProviderLanguageBlobNotProvided)(
        '%s',
        (name, getTermParameters, timesCalled, mockedValuesReturned, otherFctParameters, expectedResult) => {
            useGetSupportedLanguageDataMock.mockReturnValue(mockedValuesReturned[1]);
            getLanguageBlobMock.mockReturnValueOnce(mockedValuesReturned[2]);

            const returned = getErrorTerm(getTermParameters[0], getTermParameters[1], getTermParameters[2]);

            expect(useGetSupportedLanguageDataMock).toHaveBeenCalledTimes(timesCalled[1]);
            expect(useGetSupportedLanguageDataMock).toHaveBeenCalledWith(otherFctParameters[0]);
            expect(getLanguageBlobMock).toHaveBeenCalledTimes(timesCalled[2]);
            expect(getLanguageBlobMock).toHaveBeenCalledWith(otherFctParameters[1][0], otherFctParameters[1][1]);

            expect(returned).toBe(expectedResult);
        });

    test.each(dataProviderLanguageBlobProvided)(
        '%s',
        (name, getTermParameters, expectedResult) => {
            const returned = getErrorTerm(getTermParameters[0], getTermParameters[1], getTermParameters[2]);

            expect(useGetSupportedLanguageDataMock).not.toHaveBeenCalled();
            expect(getLanguageBlobMock).not.toHaveBeenCalled();

            expect(returned).toBe(expectedResult);
        });
});
