import {useGetDefaultSupportedLanguageIso} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';

const mockDispatch = jest.fn();
const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetDefaultSupportedLanguageIso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const hookData = [
        {clearLanguages: false, clearDefault: false, expected: 'en', dispatchCalls: 0, selectedIso: ''},
        {clearLanguages: false, clearDefault: true, expected: 'en', dispatchCalls: 0, selectedIso: ''},
        {clearLanguages: false, clearDefault: false, expected: 'en', dispatchCalls: 0, selectedIso: 'fr'}, // unsupported language
        {clearLanguages: false, clearDefault: false, expected: 'de', dispatchCalls: 0, selectedIso: 'de'}, // non-default supported language
        {clearLanguages: true, clearDefault: false, expected: null, dispatchCalls: 1, selectedIso: ''},
    ];

    test.each(hookData)(
        'rendering the hook properly ($clearLanguages, $clearDefault, $expected, $dispatchCalls, $selectedIso)',
        ({clearLanguages, clearDefault, expected, dispatchCalls, selectedIso}) => {
            store.data.application_state.order_meta_data.note_attributes['_language_iso_code'] = selectedIso;
            if(clearLanguages) {
                store.data.initial_data.supported_languages = [];
            }
            if(clearDefault) {
                store.data.initial_data.supported_languages[0].is_default = false;
            }

            const {result} = renderHook(() => useGetDefaultSupportedLanguageIso());
            expect(result.current).toStrictEqual(expected);

            expect(mockDispatch).toBeCalledTimes(dispatchCalls);
        });

});
