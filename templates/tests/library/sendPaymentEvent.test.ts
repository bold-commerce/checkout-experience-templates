import {sendEvents} from 'src/analytics';
import {sendPaymentEvent} from 'src/library';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {IOrderInitialization} from 'src/types';

jest.mock('src/analytics');
const sendEventsMock = mocked(sendEvents, true);

describe('testing sendPaymentEvent', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('tests calling sendPaymentEvent', () => {
        getState.mockReturnValue(stateMock);
        sendPaymentEvent(mockDispatch, getState);

        expect(sendEventsMock).toHaveBeenCalledTimes(1);
        expect(sendEventsMock).toHaveBeenCalledWith(
            'add_payment_info',
            {
                currency: 'CAD',
                value: 20000,
                items: stateMock.data.application_state.line_items,
                payment_type: 'credit_card',
            },
        );
    });

    test('tests calling sendPaymentEvent with multiple payments', () => {
        const multiplePaymentState: IOrderInitialization = stateMock;
        multiplePaymentState.data.application_state.payments = [
            multiplePaymentState.data.application_state.payments[0],
            {
                gateway_public_id: '1234',
                amount: 1337,
                currency: 'KRW',
                type: 'test_payment_type',
                display_string: '1111',
                id: 'test_id',
                token: 'test_token',
                retain: false,
            }
        ];
        getState.mockReturnValue(multiplePaymentState);
        sendPaymentEvent(mockDispatch, getState);

        expect(sendEventsMock).toHaveBeenCalledTimes(1);
        expect(sendEventsMock).toHaveBeenCalledWith(
            'add_payment_info',
            {
                currency: 'KRW',
                value: 1337,
                items: stateMock.data.application_state.line_items,
                payment_type: 'test_payment_type',
            },
        );
    });

    test('test calling sendPaymentEvent with no payments', () => {
        const noPaymentState: IOrderInitialization = stateMock;
        noPaymentState.data.application_state.payments = [];
        getState.mockReturnValue(noPaymentState);

        sendPaymentEvent(mockDispatch, getState);

        expect(sendEventsMock).toHaveBeenCalledTimes(0);
    });
});
