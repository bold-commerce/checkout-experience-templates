import { mocked } from 'jest-mock';
import { metaBuildPaymentDetails } from 'src/themes/flow-sdk/meta';
import {
    getBillingAddress,
    getCurrency,
    getDiscounts,
    getLineItems,
    getShipping,
    getShippingAddress
} from '@boldcommerce/checkout-frontend-library';
import { getTotals } from '@boldcommerce/checkout-express-pay-library';
import { stateMock } from 'src/mocks';
import { MetaPaymentDetailsMock, CurrencyMock, TotalMock } from 'src/themes/flow-sdk/mocks/paymentMocks';

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/getTotals');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getDiscounts');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShippingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getBillingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getLineItems');

const getCurrencyMock = mocked(getCurrency, true);
const getTotalsMock = mocked(getTotals, true);
const getShippingMock = mocked(getShipping, true);
const getShippingAddressMock = mocked(getShippingAddress, true);
const getBillingAddressMock = mocked(getBillingAddress, true);
const getLineItemsMock = mocked(getLineItems, true);
const getDiscountsMock = mocked(getDiscounts, true);

describe('metaBuildPaymentDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getCurrencyMock.mockReturnValue(CurrencyMock);
        getTotalsMock.mockReturnValue(TotalMock);
        getShippingMock.mockReturnValue(stateMock.data.application_state.shipping);
        getShippingAddressMock.mockReturnValue(stateMock.data.application_state.addresses.shipping);
        getBillingAddressMock.mockReturnValue(stateMock.data.application_state.addresses.billing);
        getLineItemsMock.mockReturnValue(stateMock.data.application_state.line_items);
        getDiscountsMock.mockReturnValue(stateMock.data.application_state.discounts);
    });

    it('should return payment details with all fields', () => {
        expect(metaBuildPaymentDetails()).toEqual(MetaPaymentDetailsMock);
    });

    it('should return payment details with empty offers', () => {
        getDiscountsMock.mockReturnValueOnce([]);
        const expectedMetaPaymentDetails = {...MetaPaymentDetailsMock, offers: []};

        expect(metaBuildPaymentDetails()).toEqual(expectedMetaPaymentDetails);
    });
})