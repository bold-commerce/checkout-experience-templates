import {getPayloadForGenerateTaxes} from 'src/library';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');

describe('testing getPayloadForGenerateTaxes', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('calling getPayloadForGenerateTaxes and not have shipping request', async () => {
        const generateTaxesPayload = getPayloadForGenerateTaxes(false);
        expect(generateTaxesPayload).toStrictEqual(null);
    });

    test('calling getPayloadForPostShippingAddress and have shipping request', async () => {
        const generateTaxesPayload = getPayloadForGenerateTaxes(true);
        expect(generateTaxesPayload).toStrictEqual({
            'apiType': 'setTaxes',
            'payload': {}
        });
    });
});
