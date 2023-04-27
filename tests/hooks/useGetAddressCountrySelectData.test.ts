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
import {mocked} from 'jest-mock';
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
    const countriesListSorted = initialDataMock.initial_data.country_info.sort((a, b) => a.name < b.name ? -1 : 1);
    const countriesList = initialDataMock.initial_data.country_info;
    const countriesOptions = countriesList.map(country => ({ value: country.iso_code, name: country.name })).sort((a, b) => a.name < b.name ? -1 : 1);
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
        useCallApiAtOnEventsMock.mockReturnValue(false);
        useGetErrorByFieldMock.mockReturnValue('');
        useGetAddressDataFieldMock.mockReturnValue(getTermValue);
        useGetCountryInfoListMock.mockReturnValue(countriesList);
    });

    test('rendering the hook properly', () => {
        useGetCountryInfoListMock.mockReturnValueOnce(countriesListSorted);

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

    test('rendering the hook properly - countryName and countryList are empty', () => {
        useGetAddressDataFieldMock.mockReturnValueOnce(getTermValue).mockReturnValueOnce('');
        useGetCountryInfoListMock.mockReturnValueOnce([]);

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual([]);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual(undefined);

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(4);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook properly - countryName is empty and countryList has 1 country', () => {
        useGetAddressDataFieldMock.mockReturnValueOnce(getTermValue).mockReturnValueOnce('');
        useGetCountryInfoListMock.mockReturnValue([countriesList[0]]);

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual([countriesOptions[0]]);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual(undefined);

        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(5);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook properly - value is empty and countryList has 1 country', () => {
        useGetAddressDataFieldMock.mockReturnValueOnce('').mockReturnValueOnce(getTermValue);
        useGetCountryInfoListMock.mockReturnValue([countriesList[0]]);

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual([countriesOptions[0]]);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual('CA');
        expect(result.current.errorMessage).toStrictEqual(undefined);

        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(5);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook properly - value AND countryList are empty', () => {
        useGetAddressDataFieldMock.mockReturnValueOnce('').mockReturnValueOnce(getTermValue);
        useGetCountryInfoListMock.mockReturnValueOnce([]);

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.countryOptions).toStrictEqual([]);
        expect(result.current.id).toStrictEqual(type+'-address__country');
        expect(result.current.name).toStrictEqual(Constants.ADDRESS_COUNTRY);
        expect(result.current.value).toStrictEqual('');
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
        useGetAddressDataFieldMock.mockReturnValue(getTermValue);
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

    test('sorts countries', () => {
        const requiredButIrrelevantCountryDetailed = {
            ...initialDataMock.initial_data.country_info[0],
            provinces: [],
        };

        useGetAddressDataFieldMock.mockReturnValue(getTermValue);
        useGetCountryInfoListMock.mockReturnValue([
            {
                ...requiredButIrrelevantCountryDetailed,
                'iso_code': 'US',
                'name': 'United States',
            },
            {
                ...requiredButIrrelevantCountryDetailed,
                'iso_code': 'CA',
                'name': 'Canada',

            },
            {
                ...requiredButIrrelevantCountryDetailed,
                'iso_code': 'ZW',
                'name': 'Zimbabwe',
            },
        ]);

        const {result} = renderHook(() => useGetAddressCountryInputData(type, debounceMock));
        const resultCountryNamesList = result.current.countryOptions.map(country => country.name);

        expect(resultCountryNamesList)
            .toEqual(['Canada', 'United States', 'Zimbabwe']);
    });


});
