import {
    useAppSelector,
    useGetAddressDataField,
    useGetBillingData,
    useGetBillingDataField,
    useGetSavedAddressOptions,
    useGetShippingData,
    useGetShippingDataField
} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {Constants} from 'src/constants';

const store = {
    data: initialDataMock
};
const shipping = initialDataMock.application_state.addresses.shipping;
const billing = initialDataMock.application_state.addresses.billing;
const savedAddresses = initialDataMock.application_state.customer.saved_addresses;
const addressField = 'address_line_1';

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetAddressData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('useGetShippingData', () => {
        const {result} = renderHook(() => useGetShippingData());
        expect(result.current).toStrictEqual(shipping);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('useGetShippingDataField', () => {
        const {result} = renderHook(() => useGetShippingDataField(addressField));
        expect(result.current).toStrictEqual(shipping[addressField]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('useGetShippingDataField with null return', () => {
        const {result} = renderHook(() => useGetShippingDataField('null_field'));
        expect(result.current).toStrictEqual('');
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('useGetBillingData', () => {
        const {result} = renderHook(() => useGetBillingData());
        expect(result.current).toStrictEqual(billing);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('useGetBillingDataField', () => {
        const {result} = renderHook(() => useGetBillingDataField(addressField));
        expect(result.current).toStrictEqual(billing[addressField]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    test('useGetBillingDataField', () => {
        const {result} = renderHook(() => useGetBillingDataField('null_field'));
        expect(result.current).toStrictEqual('');
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

    const addressDataSet = [
        {type: Constants.SHIPPING, field: addressField, data: shipping},
        {type: Constants.BILLING, field: addressField, data: billing},
    ];

    test.each(addressDataSet)(
        'useGetAddressDataField',
        ({type, field, data}) => {
            const {result} = renderHook(() => useGetAddressDataField(type, field));
            expect(result.current).toStrictEqual(data[field]);
            expect(useAppSelector).toHaveBeenCalledTimes(1);
        });

    test('useGetSavedAddressOptions', () => {
        const {result} = renderHook(() => useGetSavedAddressOptions());
        expect(result.current).toStrictEqual(savedAddresses);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

});
