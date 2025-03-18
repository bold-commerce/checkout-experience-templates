import {mocked} from 'jest-mock';
import {hydrateOrder} from 'src/eps';
import {
    baseReturnObject,
    batchRequest,
} from '@boldcommerce/checkout-frontend-library';
import {initialDataMock} from 'src/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/batch');
const batchRequestMock = mocked(batchRequest, true);

describe('testing hydrateOrder', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        batchRequestMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
    });

    test('testing hydrate order with customer, shipping address and billing address', async () => {

        await hydrateOrder(initialDataMock.application_state.addresses.shipping, initialDataMock.application_state.addresses.billing, 'John', 'Doe', 'test@test.com');

        expect(batchRequestMock).toHaveBeenCalledTimes(1);
        expect(batchRequestMock).toBeCalledWith([{
            'apiType': 'addGuestCustomer',
            'payload': {
                'accepts_marketing': false,
                'email_address': 'test@test.com',
                'first_name': 'John',
                'last_name': 'Doe',
            }
        },
        {
            'apiType': 'setShippingAddress',
            'payload': {
                'id': null,
                'address_line_1': '50 Fultz Boulevard',
                'address_line_2': '',
                'business_name': 'Bold Commerce',
                'city': 'Winnipeg',
                'country': 'Canada',
                'country_code': 'CA',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone_number': '',
                'postal_code': 'R3Y 0L6',
                'province': 'Manitoba',
                'province_code': 'MB'
            }
        },
        {
            'apiType': 'setBillingAddress',
            'payload': {
                'address_line_1': '100 Main Street',
                'address_line_2': 'Unit 123',
                'business_name': 'Bold Commerce',
                'city': 'Winnipeg',
                'country': 'Canada',
                'country_code': 'CA',
                'first_name': 'Jane',
                'last_name': 'Doe',
                'phone_number': '',
                'postal_code': 'R3Z 4S2',
                'province': 'Manitoba',
                'province_code': 'MB'
            }
        },
        {
            'apiType': 'setTaxes',
            'payload': {}
        }], 1);
    });
});