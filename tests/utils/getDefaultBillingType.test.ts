import {getDefaultBillingType, getErrorTerm} from 'src/utils';
import {initialDataMock} from 'src/mocks';
import {IAddress, setJwtToken} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {useGetAddressData} from 'src/hooks';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/useGetAddressData');
const useGetAddressDataMock = mocked(useGetAddressData, true);

describe('Test function getDefaultBillingType', () => {

    const shippingData = initialDataMock.application_state.addresses.shipping;
    const billingData = initialDataMock.application_state.addresses.billing;

    const data = [
        {name: 'testing with empty address', shipping: {}, billing: {} ,expected: Constants.SHIPPING_SAME},
        {name: 'testing with same address', shipping: shippingData, billing: shippingData ,expected: Constants.SHIPPING_SAME},
        {name: 'testing with different address', shipping: shippingData, billing: billingData ,expected: Constants.SHIPPING_DIFFERENT},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(data)(
        '$name',
        ({ name, shipping, billing, expected }) => {

            useGetAddressDataMock
                .mockReturnValueOnce(shipping as IAddress)
                .mockReturnValueOnce(billing as IAddress);

            const result = getDefaultBillingType();
            expect(result).toBe(expected);

        });
});
