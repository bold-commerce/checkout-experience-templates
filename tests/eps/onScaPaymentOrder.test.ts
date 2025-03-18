import {mocked} from 'jest-mock';
import {onScaPaymentOrder} from 'src/eps';
import {displayOrderProcessingScreen} from 'src/library';
import fetchMock from 'jest-fetch-mock';

jest.mock('src/library/displayOrderProcessingScreen');
const displayOrderProcessingScreenMock = mocked(displayOrderProcessingScreen, true);

describe('testing onScaPaymentOrder', () => {

    const dispatchMock = jest.fn();
    beforeEach(() => {
        jest.resetAllMocks();
        window.environment = {
            type: 'type',
            url: 'url',
            path: 'path'
        };
        fetchMock.enableMocks();
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({data: '123'}), {
                status: 200,
                statusText: 'OK',
                headers: {'Content-Type': 'application/json'},
            })));
    });

    test('testing ppcp sca', async () => {
        const response = await onScaPaymentOrder(dispatchMock, 'ppcp',{order_id: '234', gateway_id: 1});

        expect(response).toStrictEqual({card: {data: '123'}});
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
    });

    test('testing braintree sca', async () => {
        const response = await onScaPaymentOrder(dispatchMock, 'braintree',{order_id: '234', gateway_id: 1});

        expect(response).toStrictEqual({card: {}});
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
    });
});
