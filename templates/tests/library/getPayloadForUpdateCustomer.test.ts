import {
    getCustomer,
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    getPayloadForUpdateCustomer,
} from 'src/library';
import {stateMock} from 'src/mocks';

import {ICustomer} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/action');
jest.mock('src/utils/handleErrorIfNeeded');
const getCustomerMock = mocked(getCustomer, true);

describe('testing getPayloadForPostShippingAddress', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const newCustomerMock : ICustomer = {
        'platform_id': '4321',
        'public_id': '54321',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email_address': 'jane.doe@boldcommerce.com',
        'accepts_marketing': false,
        'saved_addresses': []
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        getCustomerMock.mockReturnValue(stateMock.data.application_state.customer);
    });

    test('calling getPayloadForUpdateCustomer with same customer returns null', async () => {
        const updateCustomerPayload = getPayloadForUpdateCustomer(dispatch, getState);
        expect(updateCustomerPayload).toStrictEqual(null);
    });

    test('calling getPayloadForPostShippingAddress with new shipping address returns payload', async () => {
        getCustomerMock.mockReturnValue(newCustomerMock);
        const updateCustomerPayload = getPayloadForUpdateCustomer(dispatch, getState);
        expect(updateCustomerPayload).toStrictEqual({
            'apiType': 'updateCustomer',
            'payload': {
                'first_name': 'John',
                'last_name': 'Doe',
                'email_address': 'john.doe@boldcommerce.com',
                'accepts_marketing': false,
            }
        });
    });
});
