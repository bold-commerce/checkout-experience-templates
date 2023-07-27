import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {
    useAppSelector,
    useGetErrors,
    useGetLifeFieldErrorMessage, useGetSupportedLanguageData
} from 'src/hooks';
import {errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {stateMock} from 'src/mocks';
import {findLanguageDataByIsoCode, getErrorTerm} from 'src/utils';
import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/hooks/rootHooks');
jest.mock('src/hooks/useGetSupportedLanguageData');
jest.mock('src/hooks/useGetErrors');
jest.mock('src/utils');
const useAppSelectorMock = mocked(useAppSelector, true);
const useGetSupportedLanguageDataMock = mocked(useGetSupportedLanguageData, true);
const getErrorTermMock = mocked(getErrorTerm, true);
const useGetErrorsMock = mocked(useGetErrors, true);
const findLanguageDataByIsoCodeMock = mocked(findLanguageDataByIsoCode, true);

describe('Testing hook useGetLifeFieldErrorMessage', () => {
    const hookReturnMock = {
        message: 'TEST',
        type: errorTypes.life_elements,
        field: '',
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.empty,
        address_type: '',
    };

    test('rendering the hook properly', () => {
        const language: ISupportedLanguage = stateMock.data.initial_data.supported_languages[0];
        useGetErrorsMock.mockReturnValueOnce([]);
        useAppSelectorMock.mockReturnValueOnce(stateMock.appSetting.languageIso);
        useGetSupportedLanguageDataMock.mockReturnValueOnce(language);
        findLanguageDataByIsoCodeMock.mockReturnValueOnce(language);
        getErrorTermMock.mockReturnValueOnce('TEST');

        const {result} = renderHook(() => useGetLifeFieldErrorMessage());
        expect(result.current).toStrictEqual(hookReturnMock);
    });
});
