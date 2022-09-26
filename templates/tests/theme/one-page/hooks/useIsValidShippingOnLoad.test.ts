import { act } from '@testing-library/react';
import { useIsValidShippingOnLoad } from 'src/themes/one-page/hooks'
import { isObjectEmpty } from 'src/utils'

import {
    useGetShippingData,
    useGetValidVariable
} from 'src//hooks'
import { emptyAddressMock, stateMock } from 'src/mocks';
import { mocked } from 'jest-mock';

jest.mock('src/hooks');

const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}));

describe('Testing hook useGetPaymentSection', () => {

    const dataArray = [
        {
            name: 'Test isValid False, has useGetShippingData Object',
            isValidShipping: false,
            shipping_address: stateMock.data.application_state.addresses.shipping,
        },
        {
            name: 'Test isValid False, has empty useGetShippingData Object ',
            isValidShipping: false,
            shipping_address: emptyAddressMock,
        },

        {
            name: 'Test isValid True, has useGetShippingData Object ',
            isValidShipping: true,
            shipping_address: stateMock.data.application_state.addresses.shipping,
        },

    ]
    beforeEach(() => {
        jest.resetAllMocks();

    });

    test.each(dataArray)('$name', async ({
        isValidShipping,
        shipping_address,
    }) => {

        useGetValidVariableMock.mockReturnValueOnce(isValidShipping);
        useGetShippingDataMock.mockReturnValueOnce(shipping_address);

        act(() => {
            useIsValidShippingOnLoad()
        })

        if (!isObjectEmpty(shipping_address) && !isValidShipping) {
            expect(mockDispatch).toHaveBeenCalled()
        } else {
            expect(mockDispatch).not.toHaveBeenCalled()
        }

    });

});