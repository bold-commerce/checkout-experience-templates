import {
    getCustomer,
    ICustomer,
    apiTypeKeys
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {
    updateCustomer,
    getPayloadForPostGuestCustomer,
} from 'src/library';
import {stateMock} from 'src/mocks';
import {IOrderInitialization} from 'src/types';

jest.mock('@boldcommerce/checkout-frontend-library/lib/customer');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/library/applicationState');
jest.mock('src/library/updateCustomer');
jest.mock('src/utils/handleErrorIfNeeded');
const getCustomerMock = mocked(getCustomer, true);

describe('testing getPayloadForPostGuestCustomer', () => {
    const dispatchMock = jest.fn();
    let getState: () => IOrderInitialization;
    const getCustomerMockData: ICustomer = {
        email_address: '',
        first_name: '',
        last_name: '',
        platform_id: '',
        accepts_marketing: true,
        saved_addresses: [],
        public_id: null
    };

    const getNewCustomerMockData: ICustomer = {
        email_address: 'test@boldcommerce.com',
        first_name: 'test',
        last_name: 'test',
        platform_id: 'test',
        accepts_marketing: true,
        saved_addresses: [],
        public_id: null
    };

    beforeEach(() => {
        getState = jest.fn().mockReturnValue(stateMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling getPayloadForPostGuestCustomer endpoint with prev customer empty successfully ', async () => {
        getCustomerMock.mockReturnValueOnce(getCustomerMockData);
        const guestCustomerPayload = getPayloadForPostGuestCustomer(dispatchMock, getState);
        expect(guestCustomerPayload).toStrictEqual({
            apiType: 'addGuestCustomer',
            payload: {
                first_name: 'John',
                last_name: 'Doe',
                email_address: 'john.doe@boldcommerce.com',
                accepts_marketing: false
            }
        });
    });

    test('calling getPayloadForPostGuestCustomer endpoint with prev customer the same successfully ', async () => {
        dispatchMock.mockReturnValue(null);
        getCustomerMock.mockReturnValueOnce(stateMock.data.application_state.customer);
        const guestCustomerPayload = getPayloadForPostGuestCustomer(dispatchMock, getState);
        expect(guestCustomerPayload).toStrictEqual(null);
    });

    test('calling getPayloadForPostGuestCustomer endpoint with new customer data successfully ', async () => {
        dispatchMock.mockReturnValue({
            apiType: apiTypeKeys.updateCustomer, payload: {
                first_name: getNewCustomerMockData.first_name,
                last_name: getNewCustomerMockData.last_name,
                email_address: getNewCustomerMockData.email_address,
                accepts_marketing: getNewCustomerMockData.accepts_marketing
            }
        });
        getCustomerMock.mockReturnValueOnce(getNewCustomerMockData);
        const guestCustomerPayload = getPayloadForPostGuestCustomer(dispatchMock, getState);
        expect(guestCustomerPayload).toStrictEqual({
            apiType: 'updateCustomer',
            payload: {
                accepts_marketing: true,
                email_address: 'test@boldcommerce.com',
                first_name: 'test',
                last_name: 'test'
            }
        });
    });

});
