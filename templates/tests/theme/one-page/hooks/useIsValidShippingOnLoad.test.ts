import { renderHook } from '@testing-library/react-hooks';
import { useIsValidShippingOnLoad } from 'src/themes/one-page/hooks'
import { hasEmptyRequiredFields } from 'src/utils'
import {
    useGetRequiredAddressFields,
    useGetShippingData,
    useGetValidVariable
} from 'src//hooks'
import { emptyAddressMock, stateMock } from 'src/mocks';
import { mocked } from 'jest-mock';

jest.mock('src/hooks');

const useGetRequiredAddressFieldsMock = mocked(useGetRequiredAddressFields, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,

}));

describe('Testing hook useIsValidShippingOnLoad', () => {
    const mockRequiredFields = [ 'first_name',
    'last_name',
    'address_line_1',
    'country',
    'city',
    'province',
    'country_code',
    'province_code',
    'postal_code'
]
    const emptyAddressWithDefaultCountry = {...emptyAddressMock}
    emptyAddressWithDefaultCountry.country = "Canada"
    const dataArray = [
        {
            name: 'Test isValid False, has useGetShippingData Object',
            isValidShipping: false,
            shipping_address: stateMock.data.application_state.addresses.shipping,
            required_fields: mockRequiredFields,
        },
        {
            name: 'Test isValid True, has empty useGetShippingData Object ',
            isValidShipping: true,
            shipping_address: emptyAddressMock,
            required_fields: mockRequiredFields,
        },
        {
            name: 'Test isValid False, has empty useGetShippingData Object ',
            isValidShipping: false,
            shipping_address: emptyAddressMock,
            required_fields: mockRequiredFields,
        },
        {
            name: 'Test isValid True, has useGetShippingData Object ',
            isValidShipping: true,
            shipping_address: stateMock.data.application_state.addresses.shipping,
            required_fields: mockRequiredFields,
        },
        {
            name: 'Test isValid True, has empty useGetShippingData Object with Default Country Canada',
            isValidShipping: true,
            shipping_address: emptyAddressWithDefaultCountry,
            required_fields: mockRequiredFields,
        },

    ]
    beforeEach(() => {
        jest.resetAllMocks();

    });

    test.each(dataArray)('$name', async ({
        isValidShipping,
        shipping_address,
        required_fields,
    }) => {

        useGetValidVariableMock.mockReturnValueOnce(isValidShipping);
        useGetShippingDataMock.mockReturnValueOnce(shipping_address);
        useGetRequiredAddressFieldsMock.mockReturnValue(required_fields);

        renderHook(() => useIsValidShippingOnLoad());
    
        const emptyRequiredFields = hasEmptyRequiredFields(
            required_fields, {...shipping_address})

        if (!emptyRequiredFields && !isValidShipping) {
            expect(mockDispatch).toHaveBeenCalled()
        } else {
            expect(mockDispatch).not.toHaveBeenCalled()
        }

    });

});