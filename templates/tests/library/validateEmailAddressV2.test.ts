import {
    apiTypeKeys,
    getCustomer,
    IBatchableRequest,
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    getPayloadForPostGuestCustomer,
    validateEmailAddressV2,
} from 'src/library';
import {stateMock} from 'src/mocks';

import {ICustomer} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/action');
jest.mock('src/library/getPayloadForPostGuestCustomer');
jest.mock('src/utils/handleErrorIfNeeded');
const getCustomerMock = mocked(getCustomer, true);
const getPayloadForPostGuestCustomerMock = mocked(getPayloadForPostGuestCustomer, true);

describe('testing validateEmailAddressV2', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const newCustomerMock: ICustomer = {
        'platform_id': '4321',
        'public_id': '54321',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email_address': 'jane.doe@boldcommerce.com',
        'accepts_marketing': false,
        'saved_addresses': []
    };
    const blankCustomer: ICustomer = {
        'platform_id': '',
        'public_id': '',
        'first_name': '',
        'last_name': '',
        'email_address': '',
        'accepts_marketing': false,
        'saved_addresses': []
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        getCustomerMock.mockReturnValue(stateMock.data.application_state.customer);
    });

    test('calling validateEmailAddressV2 with same email returns empty array', async () => {
        const updateCustomerPayload = validateEmailAddressV2(dispatch, getState);
        expect(updateCustomerPayload).toStrictEqual([]);
    });

    test('calling getPayloadForPostShippingAddress with new email address returns payload', async () => {
        getCustomerMock.mockReturnValue(newCustomerMock);
        const updateCustomerPayload = validateEmailAddressV2(dispatch, getState);
        expect(updateCustomerPayload).toStrictEqual([{
            'apiType': 'validateEmail',
            'payload': {
                'email_address': 'john.doe@boldcommerce.com',
            }
        }]);
    });

    test('calling getPayloadForPostShippingAddress with new email address returns payload', async () => {
        getCustomerMock.mockReturnValue(blankCustomer);
        const postGuestCustomerMock: IBatchableRequest = {
            apiType: apiTypeKeys.updateCustomer, payload: {
                first_name: newCustomerMock.first_name,
                last_name: newCustomerMock.last_name,
                email_address: newCustomerMock.email_address,
                accepts_marketing: newCustomerMock.accepts_marketing
            }
        };
        getPayloadForPostGuestCustomerMock.mockReturnValue(postGuestCustomerMock);
        const updateCustomerPayload = validateEmailAddressV2(dispatch, getState);
        expect(updateCustomerPayload).toStrictEqual([{
            'apiType': 'validateEmail',
            'payload': {
                'email_address': 'john.doe@boldcommerce.com',
            }
        },
        {
            'apiType': 'updateCustomer',
            'payload': {
                'accepts_marketing': false,
                'email_address': 'jane.doe@boldcommerce.com',
                'first_name': 'Jane',
                'last_name': 'Doe',
            },
        }
        ]);
    });
});
