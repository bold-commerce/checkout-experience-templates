import {render, screen} from '@testing-library/react';
import {SupportedLanguages,} from 'src/components';
import {mocked} from 'jest-mock';
import {useSupportedLanguages} from 'src/hooks';

jest.mock('src/hooks/useSupportedLanguages');
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);

describe('testing Supported languages component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Rendering component with only one language ', () => {

        useSupportedLanguagesMock.mockReturnValueOnce({languagesOptions: [{value: 'en', name: 'English'}], value: '', handleChange: jest.fn()});
        const {container} = render(<SupportedLanguages/>);

        expect(container.getElementsByClassName('supported-language__container').length).toBe(1);
        expect(container.getElementsByClassName('select-field').length).toBe(0);

    });

    test('Rendering component with more than one language ', () => {

        useSupportedLanguagesMock.mockReturnValueOnce({languagesOptions: [{value: 'en', name: 'English'}, {value: 'fr', name: 'French'}], value: '', handleChange: jest.fn()});
        const {container} = render(<SupportedLanguages/>);

        expect(container.getElementsByClassName('supported-language__container').length).toBe(1);
        expect(screen.getAllByTestId('input-select').length).toBe(1);

    });


});
