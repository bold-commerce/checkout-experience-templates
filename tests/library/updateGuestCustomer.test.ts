import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    ICustomer,
    updateCustomer as putGuestCustomer
} from '@boldcommerce/checkout-frontend-library';
import {getCustomerFromLib, updateCustomer} from 'src/library';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';
import {API_RETRY} from 'src/constants';

jest.mock('@boldcommerce/checkout-frontend-library/lib/customer');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/library/applicationState');
const putGuestCustomerMock = mocked(putGuestCustomer, true);
const getCustomerFromLibMock = mocked(getCustomerFromLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded , true);

describe('testing updateGuestCustomer', () => {
    const returnObject = {...baseReturnObject};
    let dispatch: Dispatch;
    const customer: ICustomer = stateMock.data.application_state.customer;
    let getState: () => IOrderInitialization;

    beforeEach(() => {
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling updateGuestCustomer successfully ', async () => {
        returnObject.success = true;
        putGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await updateCustomer(dispatch, getState).then(() => {
            expect(putGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(putGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing, API_RETRY);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(getCustomerFromLibMock);
        });
    });

    test('calling updateGuestCustomer unsuccessfully ', async () => {
        returnObject.success = false;
        putGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await updateCustomer(dispatch, getState).then(() => {
            expect(putGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(putGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing, API_RETRY);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(0);
        });
    });
});
