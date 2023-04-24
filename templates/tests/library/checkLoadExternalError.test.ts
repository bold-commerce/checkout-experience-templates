import {stateMock} from 'src/mocks';
import {checkLoadExternalPaymentGatewayErrors} from 'src/library/checkLoadExternalPaymentGatewayErrors';

describe('testing checkLoadExternalErrors', () => {

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const ePigiSetStateFunction = jest.fn();
    const gateway = {
        'is_test': true,
        'iframe_url': 'testURL',
        'target_div': 'payment',
        'base_url': 'testURL',
        'public_id': 'publicID',
        'location': 'payment_method_below',
        'currency': 'USD'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
    });

    test('checkLoadPigiErrors called with error', async () => {
        const actionSetButtonDisable = {payload: {field: 'paymentPageButton', value: true}, type: 'SET_BUTTON_DISABLE'};

        getStateMock.mockReturnValue(stateMock);
        const setEPigiListenerThunk = await checkLoadExternalPaymentGatewayErrors(gateway, ePigiSetStateFunction);
        await setEPigiListenerThunk(dispatchMock, getStateMock).then(() => {
            expect(ePigiSetStateFunction).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(actionSetButtonDisable);
        });
    });

    test('checkLoadPigiErrors called without error', async () => {
        const state = {...stateMock};
        state.externalPaymentGateways.isValid.add('publicID');
        const gateway = {
            'is_test': true,
            'iframe_url': 'testURL',
            'target_div': 'payment',
            'base_url': 'testURL',
            'public_id': 'publicID',
            'location': 'payment_method_below',
            'currency': 'USD'
        };
        getStateMock.mockReturnValue(state);
        const setEPigiListenerThunk = await checkLoadExternalPaymentGatewayErrors(gateway, ePigiSetStateFunction);
        await setEPigiListenerThunk(dispatchMock, getStateMock).then(() => {
            expect(ePigiSetStateFunction).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });
});
