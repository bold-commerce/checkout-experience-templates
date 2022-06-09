import {
    useCallApiAtOnEvents, useGetAddressDataField,
    useGetAddressPostalCodeAndProvinceData,
    useGetAddressProvinceInputData,
    useGetErrorByField
} from 'src/hooks';
import {Constants, debounceConstants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {IAddressPostalCodeAndProvinceDataProps} from 'src/types';
import {getTerm} from 'src/utils';
import {mocked} from 'jest-mock';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAddressPostalCodeAndProvinceData');
jest.mock('src/hooks/useGetAddressData');
const getTermMock = mocked(getTerm, true);
const useGetAddressDataFieldMock = mocked(useGetAddressDataField, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useGetAddressPostalCodeAndProvinceDataMock = mocked(useGetAddressPostalCodeAndProvinceData, true);

describe('Testing hook useGetAddressProvinceInputData', () => {
    const debounceMock = jest.fn();
    const type = Constants.SHIPPING;
    const field = Constants.ADDRESS_PROVINCE;
    const getTermValue = 'test-value';
    const countryInfo = initialDataMock.initial_data.country_info[0];
    const provinceData = {
        province: countryInfo.provinces,
        showProvince: countryInfo.show_province,
        provinceLabel: getTermValue
    } as IAddressPostalCodeAndProvinceDataProps;
    const provinceOptions = countryInfo.provinces.map(province => ({ value: province.iso_code, name: province.name }));
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
        useGetAddressPostalCodeAndProvinceDataMock.mockReturnValue(provinceData);
        useCallApiAtOnEventsMock.mockReturnValue(false);
        useGetErrorByFieldMock.mockReturnValue('');
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetAddressProvinceInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.id).toStrictEqual(type+'-address__'+field);
        expect(result.current.name).toStrictEqual(field);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.showProvince).toStrictEqual(provinceData.showProvince);
        expect(result.current.provinceOptions).toStrictEqual(provinceOptions);
        expect(result.current.errorMessage).toStrictEqual('');

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(2);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook with error', () => {
        useGetErrorByFieldMock.mockReturnValue('error');

        const {result} = renderHook(() => useGetAddressProvinceInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.id).toStrictEqual(type+'-address__'+field);
        expect(result.current.name).toStrictEqual(field);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.showProvince).toStrictEqual(provinceData.showProvince);
        expect(result.current.provinceOptions).toStrictEqual(provinceOptions);
        expect(result.current.errorMessage).toStrictEqual('error');

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(3);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook with callApi', () => {
        useCallApiAtOnEventsMock.mockReturnValue(true);
        debounceConstants.debouncedGuestCustomerFunction = jest.fn();

        const {result} = renderHook(() => useGetAddressProvinceInputData(type, debounceMock));
        expect(result.current.label).toStrictEqual(getTermValue);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.id).toStrictEqual(type+'-address__'+field);
        expect(result.current.name).toStrictEqual(field);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.showProvince).toStrictEqual(provinceData.showProvince);
        expect(result.current.provinceOptions).toStrictEqual(provinceOptions);
        expect(result.current.errorMessage).toStrictEqual('');

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(2);
        expect(debounceMock).toBeCalledTimes(1);
    });

});
