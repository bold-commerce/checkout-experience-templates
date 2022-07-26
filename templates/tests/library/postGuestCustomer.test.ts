import {baseReturnObject, addGuestCustomer, getCustomer, ICustomer} from '@bold-commerce/checkout-frontend-library';
import {Dispatch} from 'redux';
import {mocked} from 'jest-mock';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import {postGuestCustomer, updateCustomer} from 'src/library';
import * as applicationState from 'src/library/applicationState';
import {initialDataMock, stateMock} from 'src/mocks';
import {IOrderInitialization} from 'src/types';
import {API_RETRY} from 'src/constants';

jest.mock('@bold-commerce/checkout-frontend-library/lib/customer');
jest.mock('@bold-commerce/checkout-frontend-library/lib/state');
jest.mock('src/library/updateCustomer');
const addGuestCustomerMock = mocked(addGuestCustomer, true);
const updateGuestCustomerMock = mocked(updateCustomer, true);
const getCustomerMock = mocked(getCustomer, true);

describe('testing postGuestCustomer', () => {
    const returnObject = {...baseReturnObject};
    let dispatch: Dispatch;
    const customer: ICustomer = initialDataMock.application_state.customer;
    let getState: () => IOrderInitialization;
    let handleErrorSpy: jest.SpyInstance;
    let getCustomerFromLibSpy: jest.SpyInstance;
    const getCustomerMockData: ICustomer = {email_address: '', first_name: '', last_name: '', platform_id: '', accepts_marketing: true, saved_addresses: [], public_id: null};

    beforeEach(() => {
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
        handleErrorSpy = jest.spyOn(handleErrorIfNeeded, 'handleErrorIfNeeded');
        getCustomerFromLibSpy = jest.spyOn(applicationState, 'getCustomerFromLib');
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test('calling postGuestCustomer endpoint with prev customer empty successfully ', async () => {
        returnObject.success = true;
        returnObject.response = { data: { customer: customer, application_state: initialDataMock.application_state }};
        getCustomerMock.mockReturnValueOnce(getCustomerMockData);
        addGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));
        await postGuestCustomer(dispatch, getState).then(() => {
            expect(addGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(addGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing, API_RETRY);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(getCustomerFromLibSpy);
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
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(dispatch).not.toHaveBeenCalledWith(getCustomerFromLibSpy);
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
