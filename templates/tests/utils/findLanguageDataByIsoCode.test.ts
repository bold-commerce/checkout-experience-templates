import {findLanguageDataByIsoCode} from 'src/utils';
import {initialDataMock} from 'src/mocks';

describe('Test findLanguageDataByIsoCode function', () => {

    const languages = initialDataMock.initial_data.supported_languages;

    const data = [
        {languages: [], iso: '', expected: null},
        {languages: languages, iso: '', expected: null},
        {languages: languages, iso: 'en', expected: languages[0]},
    ];

    test.each(data)(
        'function called with languages: $languages, Iso: $iso',
        ({languages, iso, expected}) => {
            const result = findLanguageDataByIsoCode(languages, iso);
            expect(result).toStrictEqual(expected);
        });
});
