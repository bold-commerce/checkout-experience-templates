import {getPayloadForGetShippingLines,} from 'src/library';
import {stateMock} from 'src/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');

describe('testing getPayloadForGetShippingLines', () => {
    const getState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
    });

    test('calling getPayloadForGetShippingLines with not require shipping', async () => {
        const getShippingLinePayload = getPayloadForGetShippingLines(false, getState);
        expect(getShippingLinePayload).toStrictEqual(null);
    });

    test('calling getPayloadForGetShippingLines with require shipping but not have shipping in batch request', async () => {
        getState().data.initial_data.requires_shipping = true;
        const getShippingLinePayload = getPayloadForGetShippingLines(false, getState);
        expect(getShippingLinePayload).toStrictEqual(null);
    });

    test('calling getPayloadForGetShippingLines with require shipping and have shipping in batch request', async () => {
        getState().data.initial_data.requires_shipping = true;
        const getShippingLinePayload = getPayloadForGetShippingLines(true, getState);
        expect(getShippingLinePayload).toStrictEqual({
            'apiType': 'getShippingLines',
            'payload': {}
        });
    });
});
