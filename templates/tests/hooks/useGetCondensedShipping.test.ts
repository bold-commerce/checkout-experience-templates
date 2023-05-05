import { renderHook } from '@testing-library/react-hooks';
import { useGetCondensedShipping } from 'src/hooks';
import { initialDataMock } from 'src/mocks';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

describe('testing hook useGetCondensedShipping', () => {

    const address = initialDataMock.application_state.addresses.shipping;
    const nameValue = `${address.first_name} ${address.last_name}`
    const addressLines = [
        address.address_line_1,
        address.city,
        address.province,
        address.postal_code,
        address.country
    ]
    const addressLineValue = addressLines.join(', ');

    test('renders the useGetCondensedShippingHook properly', () => {
        const { result } = renderHook(() => useGetCondensedShipping(address as IAddress));

        expect(result.current.name).toBe(nameValue);
        expect(result.current.addressLine).toBe(addressLineValue);
    })
});
