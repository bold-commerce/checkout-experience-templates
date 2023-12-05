import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {stateMock} from 'src/mocks';
import {
    validateBillingAddress,
    validateShippingAddress,
    validateEmailAddress,
    checkErrorAndProceedToNextPage,
    callCustomerPageApi,
    updateCustomer
} from 'src/library';
import {actionSetLoaderAndDisableButton} from 'src/action';

jest.mock('src/action');
jest.mock('src/library/checkErrorAndProceedToNextPage');
jest.mock('src/library/validateBillingAddress');
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const checkErrorAndProceedToNextPageMock = mocked(checkErrorAndProceedToNextPage, true);
const validateBillingAddressMock = mocked(validateBillingAddress, true);

describe('testing callCustomerPageApi', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const checkErrorAndProceedToNextPageThunkMock = jest.fn();
    const actionSetLoaderAndDisableButtonThunkMock = jest.fn();
    const validateBillingAddressThunkMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        checkErrorAndProceedToNextPageThunkMock.mockName('checkErrorAndProceedToNextPage');
        actionSetLoaderAndDisableButtonThunkMock.mockName('actionSetLoaderAndDisableButton');
        getState.mockReturnValue(stateMock);
        dispatch.mockImplementation(fun => {
            switch (fun) {
                case checkErrorAndProceedToNextPageThunkMock:
                case actionSetLoaderAndDisableButtonThunkMock:
                case updateCustomer:
                case validateEmailAddress:
                case validateShippingAddress:
                case validateBillingAddressThunkMock:
                    return Promise.resolve();
                default:
                    return fun();
            }
        });
        checkErrorAndProceedToNextPageMock.mockReturnValue(checkErrorAndProceedToNextPageThunkMock);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonThunkMock);
        validateBillingAddressMock.mockReturnValue(validateBillingAddressThunkMock);
    });

    test('When customer platform_id is null, not logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = null;
        getState.mockReturnValueOnce(newStateMock);

        const callCustomerPageApiThunk = callCustomerPageApi(historyMock);
        await callCustomerPageApiThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('shipping_lines', 'customerPageButton', historyMock, false);
        });
    });

    test('When customer platform_id is 0, not logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '0';
        getState.mockReturnValueOnce(newStateMock);

        const callCustomerPageApiThunk = callCustomerPageApi(historyMock);
        await callCustomerPageApiThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('shipping_lines', 'customerPageButton', historyMock, false);
        });
    });

    test('When customer platform_id bigger then 0, logged in', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.application_state.customer.platform_id = '1234';
        getState.mockReturnValueOnce(newStateMock);

        const callCustomerPageApiThunk = callCustomerPageApi(historyMock);
        await callCustomerPageApiThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(dispatch).toHaveBeenCalledTimes(6);
            expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(validateEmailAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(dispatch).toHaveBeenCalledWith(validateShippingAddress);
            expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('shipping_lines', 'customerPageButton', historyMock, false);
        });
    });

    test('Redirect to payment page when not requires shipping', async () => {
        const historyMock = {} as HistoryLocationState;
        const newStateMock = {...stateMock};
        newStateMock.data.initial_data.requires_shipping = false;
        getState.mockReturnValueOnce(newStateMock);

        const callCustomerPageApiThunk = callCustomerPageApi(historyMock);
        await callCustomerPageApiThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('customerPageButton', true);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('payment', 'customerPageButton', historyMock, false);
        });
    });
});
