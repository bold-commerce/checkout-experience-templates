import {mocked} from 'jest-mock';
import {updateCustomer as putGuestCustomer} from '@bold-commerce/checkout-frontend-library';
import {getCustomerFromLib, updateCustomer} from 'src/library';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {Dispatch} from 'redux';
import {IApplicationStateCustomer, IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/library/applicationState');
const putGuestCustomerMock = mocked(putGuestCustomer, true);
const getCustomerFromLibMock = mocked(getCustomerFromLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded , true);

describe('testing updateGuestCustomer', () => {
    const returnObject = {...baseReturnObject};
    let dispatch: Dispatch;
    const customer: IApplicationStateCustomer = stateMock.data.application_state.customer;
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
            expect(putGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(getCustomerFromLibMock);
        });
    });

    test('calling updateGuestCustomer unsuccessfully ', async () => {
        returnObject.success = false;
        putGuestCustomerMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await updateCustomer(dispatch, getState).then(() => {
            expect(putGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(putGuestCustomerMock).toHaveBeenCalledWith(customer.first_name, customer.last_name, customer.email_address, customer.accepts_marketing);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(0);
        });
    });
});
