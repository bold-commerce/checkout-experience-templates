import { metaBuildPaymentOptions } from 'src/themes/flow-sdk/meta';
import { mocked } from 'jest-mock';
import { getOrderInitialData } from '@boldcommerce/checkout-frontend-library';
import { initialDataMock } from 'src/mocks';
import { MetaPaymentOptionsMock } from 'src/themes/flow-sdk/mocks/paymentMocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

describe('metaBuildPaymentOptions', () => {
    beforeAll(() => {
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
    });

    it('should return payment options with all fields', () => {
        expect(metaBuildPaymentOptions()).toEqual(MetaPaymentOptionsMock);
    });
});