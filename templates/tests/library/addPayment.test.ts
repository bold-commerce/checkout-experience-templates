import {baseReturnObject, addPayment as addPaymentLib} from '@boldcommerce/checkout-frontend-library';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {addPayment} from 'src/library';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/payment');
jest.mock('src/utils');
const addPaymentLibMock = mocked(addPaymentLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing addPayment', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();
    const returnObject = {...baseReturnObject};

    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
    });


    test('tests calling add payment', async  () => {
        const newReturnObj = {...returnObject, success: false};
        addPaymentLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const paymentObject = {
            'gateway_public_id': 'test_gateway_public_id',
            'amount': 100,
            'currency': 'USD',
            'type': 'test_type',
            'display_string': 'test_display_string',
            'token': 'test_token',
            'retain': false,
        };

        const payment = addPayment(paymentObject);
        const response = await payment(mockDispatch, getState);
        expect(addPaymentLibMock).toHaveBeenCalledTimes(1);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(response).toBe(newReturnObj);
    });

    test('tests calling add payment without handleError', async  () => {
        const newReturnObj = {...returnObject, success: false};
        addPaymentLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const paymentObject = {
            'gateway_public_id': 'test_gateway_public_id',
            'amount': 100,
            'currency': 'USD',
            'type': 'test_type',
            'display_string': 'test_display_string',
            'token': 'test_token',
            'retain': false,
        };

        const payment = addPayment(paymentObject, false);
        const response = await payment(mockDispatch, getState);
        expect(addPaymentLibMock).toHaveBeenCalledTimes(1);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
        expect(response).toBe(newReturnObj);
    });
});
