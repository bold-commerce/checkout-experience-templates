import {mocked} from 'jest-mock';
import {useAppSelector, useGetErrors, useGetFlashErrors, useGetSupportedLanguageData} from 'src/hooks';
import {stateMock} from 'src/mocks';
import {getErrorTerm, getLanguageBlob} from 'src/utils';
import {renderHook} from '@testing-library/react-hooks';
import {errorFields, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {IError} from 'src/types';

jest.mock('src/hooks/rootHooks');
jest.mock('src/hooks/useGetSupportedLanguageData');
jest.mock('src/hooks/useGetErrors');
jest.mock('src/utils');
const useAppSelectorMock = mocked(useAppSelector, true);
const useGetSupportedLanguageDataMock = mocked(useGetSupportedLanguageData, true);
const getLanguageBlobMock = mocked(getLanguageBlob, true);
const getErrorTermMock = mocked(getErrorTerm, true);
const useGetErrorsMock = mocked(useGetErrors, true);

describe('Testing hook useGetFlashErrors', () => {
    const error: Array<IError> = [{
        message: 'Test message',
        field: errorFields.discounts,
        severity: errorSeverities.critical,
        sub_type: errorSubTypes.public_order_id,
        type: errorTypes.order,
        address_type: ''
    }];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering the hook without any errors', () => {
        useGetErrorsMock.mockReturnValueOnce([]);
        useAppSelectorMock.mockReturnValueOnce(stateMock.appSetting.languageIso);
        useGetSupportedLanguageDataMock.mockReturnValueOnce(stateMock.data.initial_data.supported_languages[0]);
        getLanguageBlobMock.mockReturnValueOnce(null);

        const {result} = renderHook(() => useGetFlashErrors());
        expect(result.current).toStrictEqual([]);
        expect(getErrorTerm).toHaveBeenCalledTimes(0);
    });


    test('rendering the hook with errors but not flash', () => {
        useGetErrorsMock.mockReturnValueOnce(stateMock.errors);
        useAppSelectorMock.mockReturnValueOnce(stateMock.appSetting.languageIso);
        useGetSupportedLanguageDataMock.mockReturnValueOnce(stateMock.data.initial_data.supported_languages[0]);
        getLanguageBlobMock.mockReturnValueOnce(null);

        const {result} = renderHook(() => useGetFlashErrors());
        expect(result.current).toStrictEqual([]);
        expect(getErrorTerm).toHaveBeenCalledTimes(0);
    });

    test('rendering the hook with flash errors', () => {
        useGetErrorsMock.mockReturnValueOnce(error);
        useAppSelectorMock.mockReturnValueOnce(stateMock.appSetting.languageIso);
        useGetSupportedLanguageDataMock.mockReturnValueOnce(stateMock.data.initial_data.supported_languages[0]);
        getLanguageBlobMock.mockReturnValueOnce(null);
        getErrorTermMock.mockReturnValueOnce('TEST');


        const {result} = renderHook(() => useGetFlashErrors());
        expect(result.current).toStrictEqual(['TEST']);
        expect(getErrorTerm).toHaveBeenCalledTimes(1);
    });

    test('rendering the hook with undefined errors', () => {
        useGetErrorsMock.mockReturnValueOnce(((undefined as unknown) as IError[]));
        useAppSelectorMock.mockReturnValueOnce(stateMock.appSetting.languageIso);
        useGetSupportedLanguageDataMock.mockReturnValueOnce(stateMock.data.initial_data.supported_languages[0]);
        getLanguageBlobMock.mockReturnValueOnce(null);

        const {result} = renderHook(() => useGetFlashErrors());
        expect(result.current).toStrictEqual([]);
        expect(getErrorTerm).toHaveBeenCalledTimes(0);
    });
});
