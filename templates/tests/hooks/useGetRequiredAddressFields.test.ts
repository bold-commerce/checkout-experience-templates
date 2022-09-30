
import { useGetRequiredAddressFields, useGetGeneralSettingCheckoutFields, useGetAddressPostalCodeAndProvinceData } from 'src/hooks'
import { IAddressPostalCodeAndProvinceDataProps } from 'src/types';
import { renderHook } from '@testing-library/react-hooks';

import { Constants } from 'src/constants';
import { mocked } from 'jest-mock';

jest.mock('src/hooks/useGetGeneralSettingCheckoutFields');
jest.mock('src/hooks/useGetAddressPostalCodeAndProvinceData');

const useGetGeneralSettingCheckoutFieldsMock = mocked(useGetGeneralSettingCheckoutFields, true);
const useGetAddressPostalCodeAndProvinceDataMock = mocked(useGetAddressPostalCodeAndProvinceData, true);

describe('testing useGetRequiredAddressFields', () => {
    const addressTests = [
            {
                name: `test using type all as required`,
                type: Constants.SHIPPING,
                data: {
                    showPostalCode: true,
                    showProvince: true,
                    phone: true
                },
                exepcted: 10
            }, {
                name: `test using type postalcode & province as true`,
                type: Constants.SHIPPING,
                data: {
                    showPostalCode: true,
                    showProvince: true,
                    phone: false
                },
                exepcted: 9
            },
            {
                name: `test using type all as not required`,
                type: Constants.SHIPPING,
                data: {
                    showPostalCode: false,
                    showProvince: false,
                    phone: false
                },
                exepcted: 6
            }
        ]

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each(addressTests)('$name', async ({
        type,
        exepcted,
        data,
    }) => {

        useGetAddressPostalCodeAndProvinceDataMock.mockReturnValue({ showPostalCode: data.showPostalCode, showProvince: data.showProvince } as IAddressPostalCodeAndProvinceDataProps);
        useGetGeneralSettingCheckoutFieldsMock.mockReturnValue(data.phone)

        const { result } = renderHook(() => useGetRequiredAddressFields(type));
        expect(result.current.length).toBe(exepcted);
    })

});
