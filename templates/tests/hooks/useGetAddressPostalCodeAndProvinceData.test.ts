import {
    useGetAddressDataField,
    useGetAddressPostalCodeAndProvinceData,
    useGetCountryInfoByCountryCode,
    useGetCountryInfoList
} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/hooks/useGetCountryData');
jest.mock('src/hooks/useGetAddressData');
const useGetCountryInfoByCountryCodeMock = mocked(useGetCountryInfoByCountryCode, true);
const useGetCountryInfoListMock = mocked(useGetCountryInfoList, true);
const useGetAddressDataFieldMock = mocked(useGetAddressDataField, true);

describe('Testing hook useGetAddressPostalCodeAndProvinceData', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering the hook properly', () => {
        const countryCode = 'CA';
        const countryList = initialDataMock.initial_data.country_info;
        const countryInfo: ICountryInformation = countryList[0];

        useGetAddressDataFieldMock.mockReturnValueOnce(countryCode);
        useGetCountryInfoByCountryCodeMock.mockReturnValueOnce(countryInfo);

        const {result} = renderHook(() => useGetAddressPostalCodeAndProvinceData(countryCode));
        expect(result.current.showProvince).toStrictEqual(true);
        expect(result.current.showPostalCode).toStrictEqual(true);
        expect(result.current.provinceLabel).toStrictEqual(countryInfo.province_label);
        expect(result.current.province).toStrictEqual(countryInfo.provinces);
    });

    test('rendering the hook no country found and country list empty', () => {
        const countryCode = '';
        useGetAddressDataFieldMock.mockReturnValueOnce(countryCode);
        useGetCountryInfoByCountryCodeMock.mockReturnValueOnce(undefined);
        useGetCountryInfoListMock.mockReturnValueOnce([]);

        const {result} = renderHook(() => useGetAddressPostalCodeAndProvinceData(countryCode));
        expect(result.current.showProvince).toStrictEqual(false);
        expect(result.current.showPostalCode).toStrictEqual(false);
        expect(result.current.provinceLabel).toStrictEqual('');
        expect(result.current.province).toStrictEqual([]);
    });

    test('rendering the hook no country found and country list with 1 country', () => {
        const countryCode = '';
        const countryList = initialDataMock.initial_data.country_info;
        useGetAddressDataFieldMock.mockReturnValueOnce(countryCode);
        useGetCountryInfoListMock.mockReturnValueOnce([countryList[0]]);
        useGetCountryInfoByCountryCodeMock.mockReturnValueOnce(countryList[0]);

        const {result} = renderHook(() => useGetAddressPostalCodeAndProvinceData(countryCode));
        expect(result.current.showProvince).toStrictEqual(true);
        expect(result.current.showPostalCode).toStrictEqual(true);
        expect(result.current.provinceLabel).toStrictEqual(countryList[0].province_label);
        expect(result.current.province).toStrictEqual(countryList[0].provinces);
    });

    test('Sorting duplicate', () => {
        const countryCode = 'CA';
        const countryList = initialDataMock.initial_data.country_info;
        const countryInfo: ICountryInformation = {...countryList[0], provinces: [countryList[0].provinces[0], ...countryList[0].provinces]};

        useGetAddressDataFieldMock.mockReturnValueOnce(countryCode);
        useGetCountryInfoByCountryCodeMock.mockReturnValueOnce(countryInfo);

        const {result} = renderHook(() => useGetAddressPostalCodeAndProvinceData(countryCode));
        expect(result.current.showProvince).toStrictEqual(true);
        expect(result.current.showPostalCode).toStrictEqual(true);
        expect(result.current.provinceLabel).toStrictEqual(countryInfo.province_label);
        expect(result.current.province).toStrictEqual(countryInfo.provinces);
    });
});
