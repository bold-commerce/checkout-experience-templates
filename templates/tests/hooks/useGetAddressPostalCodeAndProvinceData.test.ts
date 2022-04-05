import {
    useGetAddressDataField,
    useGetAddressPostalCodeAndProvinceData,
    useGetCountryInfoByCountryCode
} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {ICountryInformation} from 'src/types';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/useGetCountryData');
jest.mock('src/hooks/useGetAddressData');
const useGetCountryInfoByCountryCodeMock = mocked(useGetCountryInfoByCountryCode, true);
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

    test('rendering the hook no country found', () => {
        const countryCode = '';
        useGetAddressDataFieldMock.mockReturnValueOnce(countryCode);
        useGetCountryInfoByCountryCodeMock.mockReturnValueOnce(undefined);

        const {result} = renderHook(() => useGetAddressPostalCodeAndProvinceData(countryCode));
        expect(result.current.showProvince).toStrictEqual(false);
        expect(result.current.showPostalCode).toStrictEqual(false);
        expect(result.current.provinceLabel).toStrictEqual('');
        expect(result.current.province).toStrictEqual([]);
    });

});
