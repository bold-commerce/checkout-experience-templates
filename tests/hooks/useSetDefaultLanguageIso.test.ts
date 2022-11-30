import {useGetDefaultSupportedLanguageIso, useSetDefaultLanguageIso} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {actionSetLanguageIso} from 'src/action';

const dispatchMock = jest.fn();
jest.mock('react-redux');
jest.mock('src/hooks/useGetDefaultSupportedLanguageIso');
const useDispatchMock = mocked(useDispatch, true);
const useGetDefaultSupportedLanguageIsoMock = mocked(useGetDefaultSupportedLanguageIso, true);

describe('Testing hook useSetDefaultLanguageIso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('render hook properly', () => {
        const language = 'en';
        useDispatchMock.mockReturnValue(dispatchMock);
        useGetDefaultSupportedLanguageIsoMock.mockReturnValueOnce(language);

        renderHook(() => useSetDefaultLanguageIso());
        expect(dispatchMock).toBeCalledWith(actionSetLanguageIso(language));
        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    test('render hook without language', () => {
        useDispatchMock.mockReturnValue(dispatchMock);
        useGetDefaultSupportedLanguageIsoMock.mockReturnValueOnce(null);

        renderHook(() => useSetDefaultLanguageIso());
        expect(dispatchMock).toHaveBeenCalledTimes(0);
    });
});
