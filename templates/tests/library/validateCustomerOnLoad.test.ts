import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {stateMock} from 'src/mocks';
import {
    validateBillingAddress,
    validateShippingAddress,
    validateEmailAddress,
    updateCustomer,
    validateCustomerOnLoad, returnToPageOnError
} from 'src/library';
import {actionSetLoaderAndDisableButton} from 'src/action';

jest.mock('src/action');
jest.mock('src/library/returnToPageOnError');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const returnToPageOnErrorMock = mocked(returnToPageOnError, true);

describe('testing validateCustomerOnLoad', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const returnToPageOnErrorThunkMock = jest.fn();
    const actionSetLoaderAndDisableButtonThunkMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        dispatch.mockImplementation(fun => {
            switch (fun) {
                case returnToPageOnErrorThunkMock:
                case actionSetLoaderAndDisableButtonThunkMock:
                case updateCustomer:
                case validateEmailAddress:
                case validateShippingAddress:
                case validateBillingAddress:
                    return Promise.resolve();
                default:
                    return fun();
            }
        });
        returnToPageOnErrorMock.mockReturnValue(returnToPageOnErrorThunkMock);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonThunkMock);
    });

    test('When customer platform_id is null, not logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = null;
        getState.mockReturnValueOnce(newStateMock);

        const validateCustomerOnLoadThunk = validateCustomerOnLoad(historyMock);
        await validateCustomerOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(1);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
        });
    });

    test('When customer platform_id is 0, not logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '0';
        getState.mockReturnValueOnce(newStateMock);

        const validateCustomerOnLoadThunk = validateCustomerOnLoad(historyMock);
        await validateCustomerOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(1);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
        });
    });

    test('When customer platform_id bigger then 0, logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '1234';
        getState.mockReturnValueOnce(newStateMock);

        const validateCustomerOnLoadThunk = validateCustomerOnLoad(historyMock);
        await validateCustomerOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(1);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
        });
    });
});
