import {
    useCallApiAtOnEvents,
    useGetAddressCountryInputData,
    useGetAddressDataField,
    useGetCountryInfoList,
    useGetErrorByField
} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {Constants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'ts-jest/utils';
import {getTerm} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetCountryData');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAddressData');
const getTermMock = mocked(getTerm, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetCountryInfoListMock = mocked(useGetCountryInfoList, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useGetAddressDataFieldMock = mocked(useGetAddressDataField, true);

describe('Testing hook useGetAddressCountrySelectData', () => {
    const debounceMock = jest.fn();
    const type = 'test';
    const getTermValue = 'test-value';
    const countriesList = initialDataMock.initial_data.country_info;
    const countriesOptions = countriesList.map(country => ({ value: country.iso_code, name: country.name }));
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
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetAddressDataFieldMock.mockReturnValue(getTermValue);
        useGetCountryInfoListMock.mockReturnValue(countriesList);
        useCallApiAtOnEventsMock.mockReturnValue(false);
        useGetErrorByFieldMock.mockReturnValue('');
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual(countriesOptions);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual(undefined);

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(4);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook with error', () => {
        useGetErrorByFieldMock
            .mockReturnValueOnce('error')
            .mockReturnValueOnce('error');

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual(countriesOptions);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual('error error');

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(6);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook with callApi', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual(countriesOptions);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual(undefined);

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(4);
        expect(debounceMock).toBeCalledTimes(1);
    });

});
