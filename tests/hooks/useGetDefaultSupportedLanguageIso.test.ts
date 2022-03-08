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
        {clearLanguages: false, clearDefault: false, expected: 'en', dispatchCalls: 0},
        {clearLanguages: false, clearDefault: true, expected: 'en', dispatchCalls: 0},
        {clearLanguages: true, clearDefault: false, expected: null, dispatchCalls: 1},
    ];

    test.each(hookData)(
        'rendering the hook properly ($clearLanguages, $clearDefault, $expected, $dispatchCalls)',
        ({clearLanguages, clearDefault, expected, dispatchCalls}) => {
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
