import {initialDataMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {useGetAppSettingData, useSupportedLanguages} from 'src/hooks';
import {mocked} from 'jest-mock';

const mockDispatch = jest.fn();
const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

jest.mock('src/hooks/useGetAppSettingData');
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing hook useGetDefaultSupportedLanguageIso', () => {
    const target ={
        target: {
            value: '',
            selectedIndex: 0,
            0: {
                text: 'test'
            }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('render hook properly', () => {
        const language = 'en';
        useGetAppSettingDataMock.mockReturnValueOnce(language);

        const {result} = renderHook(() => useSupportedLanguages());
        const hookResult = result.current;
        expect(hookResult.value).toBe('en');
        expect(mockDispatch).toHaveBeenCalledTimes(0);

        hookResult.handleChange(target);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });


});
