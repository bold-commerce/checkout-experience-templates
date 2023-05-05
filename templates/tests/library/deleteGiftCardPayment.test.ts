import {mocked} from 'jest-mock';
import {baseReturnObject, deleteGiftCardPayment, IPayment} from '@boldcommerce/checkout-frontend-library';
import {initialDataMock, stateMock} from 'src/mocks';
import {deleteGiftCardPayment as deleteGiftCardPaymentTemplate, getSummaryStateFromLib} from 'src/library';
import {handleErrorIfNeeded} from 'src/utils';
import {actionDeleteElement, actionSetLoaderAndDisableButton, REMOVE_PAYMENT} from 'src/action';

jest.mock('src/utils');
jest.mock('src/action');
jest.mock('src/library/applicationState');
jest.mock('@boldcommerce/checkout-frontend-library/lib/payment');
const deleteGiftCardPaymentMock = mocked(deleteGiftCardPayment, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const actionDeleteElementMock = mocked(actionDeleteElement, true);
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);

describe('testing delete Payment Thunk Action', () => {
    const returnObject = {...baseReturnObject};
    const {application_state} = initialDataMock;
    const paymentId = '1';
    const giftCardPayment: IPayment = {
        gateway_public_id: '',
        amount: 20000,
        currency: 'CAD',
        type: 'gift_card',
        display_string: '1111',
        id: '1',
        token: 'payment_token',
        retain: false,
        brand: ''
    };
    const newStateMock = {...stateMock, data: {...stateMock.data, application_state: {...application_state, payments: [giftCardPayment]}}};
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        returnObject.success = true;
        returnObject.response = {data: {application_state}};
        getStateMock.mockReturnValue(newStateMock);
        actionDeleteElementMock.mockReturnValue({type: REMOVE_PAYMENT, payload: {id: paymentId}});
    });

    test('calling delete gift card payment successful', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;

        deleteGiftCardPaymentMock.mockReturnValue(Promise.resolve(localReturnObject));
        const deletePaymentThunk = deleteGiftCardPaymentTemplate(paymentId);
        await deletePaymentThunk(dispatchMock, getStateMock).then(() => {
            expect(deleteGiftCardPaymentMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenCalledWith(getSummaryStateFromLibMock);
            expect(actionDeleteElementMock).toHaveBeenCalled();
            expect(actionDeleteElementMock).toHaveBeenCalledWith(REMOVE_PAYMENT, paymentId);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('paymentClose', false);
        });
    });

    test('calling delete gift card payment failure', async () => {
        const localReturnObject = {...baseReturnObject};
        deleteGiftCardPaymentMock.mockReturnValue(Promise.resolve(localReturnObject));
        const deletePaymentThunk = deleteGiftCardPaymentTemplate(paymentId);
        await deletePaymentThunk(dispatchMock, getStateMock).then(() => {
            expect(deleteGiftCardPaymentMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
            expect(actionDeleteElementMock).not.toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('paymentClose', false);
        });
    });

    test('calling delete gift card payment missing payment data', async () => {
        const localStateMock = {...stateMock, data: {...stateMock.data, application_state: {...application_state, payments: []}}};
        const localReturnObject = {...baseReturnObject};
        deleteGiftCardPaymentMock.mockReturnValue(Promise.resolve(localReturnObject));
        getStateMock.mockReturnValue(localStateMock);
        const deletePaymentThunk = deleteGiftCardPaymentTemplate(paymentId);
        await deletePaymentThunk(dispatchMock, getStateMock).then(() => {
            expect(deleteGiftCardPaymentMock).not.toHaveBeenCalled();
            expect(handleErrorIfNeededMock).not.toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
            expect(actionDeleteElementMock).not.toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('paymentClose', false);
        });
    });

    test('calling delete gift card payment not gift card', async () => {
        const localStateMock = {...stateMock};
        const localReturnObject = {...baseReturnObject};
        deleteGiftCardPaymentMock.mockReturnValue(Promise.resolve(localReturnObject));
        getStateMock.mockReturnValue(localStateMock);
        const deletePaymentThunk = deleteGiftCardPaymentTemplate(paymentId);
        await deletePaymentThunk(dispatchMock, getStateMock).then(() => {
            expect(deleteGiftCardPaymentMock).not.toHaveBeenCalled();
            expect(handleErrorIfNeededMock).not.toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(getSummaryStateFromLibMock);
            expect(actionDeleteElementMock).not.toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('paymentClose', false);
        });
    });
});
