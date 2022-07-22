import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {stateMock} from 'src/mocks';
import {
    validateBillingAddress,
    validateShippingAddress,
    validateEmailAddress,
    updateCustomer,
    returnToPageOnError,
    validateCustomerAndShippingOnLoad,
    validateShippingLine
} from 'src/library';
import {actionSetLoaderAndDisableButton} from 'src/action';

jest.mock('src/action');
jest.mock('src/library/returnToPageOnError');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const returnToPageOnErrorMock = mocked(returnToPageOnError, true);

describe('testing validateCustomerAndShippingOnLoad', () => {
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
                case validateShippingLine:
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
        newStateMock.data.application_state.shipping.selected_shipping = {id: '', description: '', amount: 0};
        newStateMock.errors = [];
        getState.mockReturnValue(newStateMock);

        const validateCustomerAndShippingOnLoadThunk = validateCustomerAndShippingOnLoad(historyMock);
        await validateCustomerAndShippingOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(8);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(updateCustomer);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingLine);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(2);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('shipping_lines', 'shippingPageButton', historyMock);
        });
    });

    test('When customer platform_id is 0, not logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '0';
        newStateMock.errors = [];
        getState.mockReturnValue(newStateMock);

        const validateCustomerAndShippingOnLoadThunk = validateCustomerAndShippingOnLoad(historyMock);
        await validateCustomerAndShippingOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(8);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(updateCustomer);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingLine);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(2);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('shipping_lines', 'shippingPageButton', historyMock);
        });
    });

    test('When customer platform_id bigger then 0, logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '1234';
        newStateMock.errors = [];
        getState.mockReturnValue(newStateMock);

        const validateCustomerAndShippingOnLoadThunk = validateCustomerAndShippingOnLoad(historyMock);
        await validateCustomerAndShippingOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(8);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingLine);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(2);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('shipping_lines', 'shippingPageButton', historyMock);
        });
    });

    test('When customer platform_id bigger then 0, logged in and error before shipping', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '1234';
        getState.mockReturnValue(newStateMock);

        const validateCustomerAndShippingOnLoadThunk = validateCustomerAndShippingOnLoad(historyMock);
        await validateCustomerAndShippingOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(updateCustomer);
            expect(dispatch).not.toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).not.toHaveBeenCalledWith(validateShippingLine);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(1);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
            expect(returnToPageOnErrorMock).not.toHaveBeenCalledWith('shipping_lines', 'shippingPageButton', historyMock);
        });
    });

    test('When customer platform_id is null, not logged in and error before shipping', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = null;
        getState.mockReturnValue(newStateMock);

        const validateCustomerAndShippingOnLoadThunk = validateCustomerAndShippingOnLoad(historyMock);
        await validateCustomerAndShippingOnLoadThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(updateCustomer);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateBillingAddress);
            expect(dispatch).not.toHaveBeenCalledWith(validateShippingLine);
            expect(dispatch).toHaveBeenCalledWith(returnToPageOnErrorThunkMock);
            expect(returnToPageOnErrorMock).toHaveBeenCalledTimes(1);
            expect(returnToPageOnErrorMock).toHaveBeenCalledWith('', 'customerPageButton', historyMock);
            expect(returnToPageOnErrorMock).not.toHaveBeenCalledWith('shipping_lines', 'shippingPageButton', historyMock);
        });
    });
});
