import {baseReturnObject, getCustomer, ICustomer, validateEmail} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';
import {validateEmailAddress, postGuestCustomer} from 'src/library';
import {stateMock} from 'src/mocks/stateMock';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/customer');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/utils/isObjectEqual');
jest.mock('src/library/postGuestCustomer');
const validateEmailMock = mocked(validateEmail, true);
const getCustomerMock = mocked(getCustomer, true);
const handleErrorMock = mocked(handleErrorIfNeeded, true);
const postGuestCustomerMock = mocked(postGuestCustomer, true);
const isObjectEqualsMock = mocked(isObjectEquals, true);

describe('testing validateEmailAddress', () => {
    const returnObject = {...baseReturnObject};
    const fakeInvalidData = {something: 'different'};
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
    });

    test('calling validate email address endpoint with getState returning undefined', async () => {
        getState.mockReturnValueOnce(undefined);

        await validateEmailAddress(dispatch, getState).catch((error) => {
            expect(error).toBeTruthy();
        });

        expect(validateEmailMock).toHaveBeenCalledTimes(0);
        expect(getCustomerMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate email address endpoint with getState returning a different data structure', async () => {
        getState.mockReturnValueOnce(fakeInvalidData);

        await validateEmailAddress(dispatch, getState).catch((error) => {
            expect(error).toBeTruthy();
        });

        expect(validateEmailMock).toHaveBeenCalledTimes(0);
        expect(getCustomerMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate email address endpoint with getCustomer returning undefined', async () => {
        getCustomerMock.mockReturnValueOnce(undefined as unknown as ICustomer);

        await validateEmailAddress(dispatch, getState).catch((error) => {
            expect(error).toBeTruthy();
        });

        expect(validateEmailMock).toHaveBeenCalledTimes(0);
        expect(getCustomerMock).toHaveBeenCalledTimes(1);
    });

    test('calling validate email address endpoint with getCustomer returning a different data structure', async () => {
        getCustomerMock.mockReturnValueOnce(stateMock.data.application_state.customer);

        await validateEmailAddress(dispatch, getState).then(() => {
            expect(validateEmailMock).toHaveBeenCalledTimes(0);
            expect(getCustomerMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling validate email address endpoint with success true', async () => {
        returnObject.success = true;
        validateEmailMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getCustomerMock.mockReturnValueOnce({} as ICustomer);

        await validateEmailAddress(dispatch, getState).then(() => {
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(postGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(postGuestCustomerMock).toHaveBeenCalledWith(dispatch, getState);
            expect(validateEmailMock).toHaveBeenCalledTimes(1);
            expect(getCustomerMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling validate email address endpoint with success false', async () => {
        returnObject.success = false;
        validateEmailMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getCustomerMock.mockReturnValueOnce({} as ICustomer);

        await validateEmailAddress(dispatch, getState).then(() => {
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(postGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(postGuestCustomerMock).toHaveBeenCalledWith(dispatch, getState);
            expect(validateEmailMock).toHaveBeenCalledTimes(1);
            expect(getCustomerMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling validate email address endpoint with different firstname but same email', async () => {
        const prevCustomerMock = stateMock.data.application_state.customer;
        prevCustomerMock.first_name = 'Test name';
        getCustomerMock.mockReturnValueOnce(prevCustomerMock);
        isObjectEqualsMock.mockReturnValueOnce(false);

        await validateEmailAddress(dispatch, getState).then(() => {
            expect(handleErrorMock).toHaveBeenCalledTimes(0);
            expect(postGuestCustomerMock).toHaveBeenCalledTimes(1);
            expect(postGuestCustomerMock).toHaveBeenCalledWith(dispatch, getState);
            expect(validateEmailMock).toHaveBeenCalledTimes(0);
            expect(getCustomerMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling validate email address endpoint with same customer as previous', async () => {
        const prevCustomerMock = stateMock.data.application_state.customer;
        getCustomerMock.mockReturnValueOnce(prevCustomerMock);
        isObjectEqualsMock.mockReturnValueOnce(true);

        await validateEmailAddress(dispatch, getState).then(() => {
            expect(handleErrorMock).toHaveBeenCalledTimes(0);
            expect(postGuestCustomerMock).toHaveBeenCalledTimes(0);
            expect(validateEmailMock).toHaveBeenCalledTimes(0);
            expect(getCustomerMock).toHaveBeenCalledTimes(1);
        });
    });

});
