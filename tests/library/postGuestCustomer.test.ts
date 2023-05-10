import {baseReturnObject, addGuestCustomer, getCustomer, ICustomer} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {API_RETRY} from 'src/constants';
import {postGuestCustomer, updateCustomer, getCustomerFromLib} from 'src/library';
import {initialDataMock, stateMock} from 'src/mocks';
import {IOrderInitialization} from 'src/types';
import {handleErrorIfNeeded} from 'src/utils/handleErrorIfNeeded';

jest.mock('@boldcommerce/checkout-frontend-library/lib/customer');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('src/library/applicationState');
jest.mock('src/library/updateCustomer');
jest.mock('src/utils/handleErrorIfNeeded');
const addGuestCustomerMock = mocked(addGuestCustomer, true);
const updateGuestCustomerMock = mocked(updateCustomer, true);
const getCustomerMock = mocked(getCustomer, true);
const getCustomerFromLibMock = mocked(getCustomerFromLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing postGuestCustomer', () => {
    const returnObject = {...baseReturnObject};
    let dispatch: Dispatch;
    const customer: ICustomer = initialDataMock.application_state.customer;
    let getState: () => IOrderInitialization;
    const getCustomerMockData: ICustomer = {email_address: '', first_name: '', last_name: '', platform_id: '', accepts_marketing: true, saved_addresses: [], public_id: null};

    beforeEach(() => {
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling postGuestCustomer endpoint with prev customer empty successfully ', async () => {
        returnObject.success = true;
        returnObject.response = { data: { customer: customer, application_state: initialDataMock.application_state }};
        getCustomerMock.mockReturnValueOnce(getCustomerMockData);
        addGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await postGuestCustomer(dispatch, getState).then(() => {
            expect(addGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(addGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing, API_RETRY);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(getCustomerFromLibMock);
        }).catch(error => {
            expect(error).toBe(null);
        });
    });

    test('calling postGuestCustomer endpoint with prev customer empty unsuccessfully ', async () => {
        returnObject.success = false;
        addGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getCustomerMock.mockReturnValueOnce(getCustomerMockData);
        addGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await postGuestCustomer(dispatch, getState).then(() => {
            expect(addGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(addGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing, API_RETRY);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).not.toHaveBeenCalledWith(getCustomerFromLibMock);
        }).catch(error => {
            expect(error).toBe(null);
        });
    });

    test('calling postGuestCustomer with updated values', async () => {
        returnObject.success = true;
        returnObject.response = { data: { customer: customer, application_state: initialDataMock.application_state }};
        getCustomerMock.mockReturnValueOnce({...getCustomerMockData, email_address: 'joes@gmail.com'});
        addGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));
        updateGuestCustomerMock.mockReturnValueOnce(Promise.resolve());
        await postGuestCustomer(dispatch, getState).then(() => {
            expect(addGuestCustomerMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledWith(updateGuestCustomerMock);
        });
    });

});
