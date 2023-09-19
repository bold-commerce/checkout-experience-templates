import {Constants, defaultAddressState} from 'src/constants';
import {validateAddressFunctionV2} from 'src/library';
import {initialDataMock, stateMock} from 'src/mocks';

describe('testing validateAddressFunctionV2', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling validate address v2 with shipping ', async () => {
        const {billing} = initialDataMock.application_state.addresses;
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunctionV2(Constants.BILLING, billing, defaultAddressState);
        const validateAddressPayload = await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressPayload).toStrictEqual([
            {
                apiType: 'setBillingAddress',
                payload: {
                    first_name: 'Jane',
                    last_name: 'Doe',
                    address_line_1: '100 Main Street',
                    address_line_2: 'Unit 123',
                    country: 'Canada',
                    city: 'Winnipeg',
                    province: 'Manitoba',
                    country_code: 'CA',
                    province_code: 'MB',
                    postal_code: 'R3Z 4S2',
                    business_name: 'Bold Commerce',
                    phone_number: ''
                }
            }
        ]);
    });

    test('calling validate address v2 with billing ', async () => {
        const {shipping} = initialDataMock.application_state.addresses;
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunctionV2(Constants.SHIPPING, shipping, defaultAddressState);
        const validateAddressPayload = await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressPayload).toStrictEqual([
            {
                apiType: 'setShippingAddress',
                payload: {
                    first_name: 'John',
                    last_name: 'Doe',
                    address_line_1: '50 Fultz Boulevard',
                    country: 'Canada',
                    city: 'Winnipeg',
                    province: 'Manitoba',
                    country_code: 'CA',
                    province_code: 'MB',
                    postal_code: 'R3Y 0L6',
                    business_name: 'Bold Commerce',
                    address_line_2: '',
                    phone_number: ''
                }
            }
        ]);
    });

    test('calling validate address v2 with shipping results in delete', async () => {
        const {shipping} = initialDataMock.application_state.addresses;
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunctionV2(Constants.SHIPPING, defaultAddressState, shipping);
        const validateAddressPayload = await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressPayload).toStrictEqual([{apiType: 'deleteShippingAddress', payload: {API_RETRY: 1}}]);
    });

    test('calling validate address v2 with billing results in delete', async () => {
        const {billing} = initialDataMock.application_state.addresses;
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunctionV2(Constants.BILLING, defaultAddressState, billing);
        const validateAddressPayload = await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressPayload).toStrictEqual([{apiType: 'deleteBillingAddress', payload: {API_RETRY: 1}}]);
    });

    test('calling validate address v2 with same billing address', async () => {
        const {billing} = initialDataMock.application_state.addresses;
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunctionV2(Constants.BILLING, billing, billing);
        const validateAddressPayload = await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressPayload).toStrictEqual([]);
    });

    test('calling validate address v2 with same shipping address', async () => {
        const {shipping} = initialDataMock.application_state.addresses;
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunctionV2(Constants.SHIPPING, shipping, shipping);
        const validateAddressPayload = await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressPayload).toStrictEqual([]);
    });
});
