import {
    handleExternalPaymentGatewayAddPayment,
    handleExternalPaymentGatewayInitialized,
    removeExternalPaymentGatewayListenerInLibrary,
    setExternalPaymentGatewayListenerInLibrary
} from 'src/library';
import {stateMock} from 'src/mocks';
import {
    setExternalPaymentGatewayListener,
    removeExternalPaymentGatewayListener,
    sendExternalPaymentGatewayUpdateStateAction, IExternalPaymentGateway
} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {IExternalPaymentGatewayAddPayment} from "src/types";

jest.mock('@bold-commerce/checkout-frontend-library/lib/externalPaymentGateway/setExternalPaymentGatewayListener');
jest.mock('@bold-commerce/checkout-frontend-library/lib/externalPaymentGateway/actionsToIframe/sendExternalPaymentGatewayUpdateStateAction');
const setExternalPaymentGatewayListenerMock = mocked(setExternalPaymentGatewayListener, true);
const removeExternalPaymentGatewayListenerMock = mocked(removeExternalPaymentGatewayListener, true);
const sendExternalPaymentGatewayUpdateStateActionMock = mocked(sendExternalPaymentGatewayUpdateStateAction, true);

describe('testing setExternalPaymentGatewayListenerInLibrary', () => {
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
        setExternalPaymentGatewayListenerMock.mockReturnValue();
    });

    test('call with language found on state', async () => {
        await setExternalPaymentGatewayListenerInLibrary(gateway, (evt: Event): void => { /* do nothing */ })();

        expect(setExternalPaymentGatewayListenerMock).toHaveBeenCalled();
    });
});

describe('testing removeExternalPaymentGatewayListenerInLibrary', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        setExternalPaymentGatewayListenerMock.mockReturnValue();
    });

    test('call with language found on state', async () => {
        await removeExternalPaymentGatewayListenerInLibrary()();

        expect(removeExternalPaymentGatewayListenerMock).toHaveBeenCalled();
    });
});

describe('testing handleExternalPaymentGatewayInitialized', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
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
        dispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
        setExternalPaymentGatewayListenerMock.mockReturnValue();
    });

    test('call sendExternalPaymentGatewayUpdateStateAction', async () => {
        await handleExternalPaymentGatewayInitialized(gateway)(dispatch, getState);

        expect(getState).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(sendExternalPaymentGatewayUpdateStateActionMock).toHaveBeenCalled();
    });
});

describe('testing handleExternalPaymentGatewayAddPayment', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const gateway = {
        'is_test': true,
        'iframe_url': 'testURL',
        'target_div': 'payment',
        'base_url': 'testURL',
        'public_id': 'publicID',
        'location': 'payment_method_below',
        'currency': 'USD',
    };
    const payload = {
        'amount': 100,
        'currency': 'USD',
        'display_string': 'test_display_string',
        'retain': false,
        'token': 'test_token',
        'type': 'test_type',
        'gateway_public_id': gateway.public_id,
        'height': 100,
        'external_id': 'test_external_id'
    };


    beforeEach(() => {
        jest.resetAllMocks();
        dispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
        setExternalPaymentGatewayListenerMock.mockReturnValue();
    });

    test('call sendExternalPaymentGatewayAddPaymentAction', async () => {
        await handleExternalPaymentGatewayAddPayment(gateway, payload)(dispatch, getState);

        expect(getState).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(2);
    });
});
