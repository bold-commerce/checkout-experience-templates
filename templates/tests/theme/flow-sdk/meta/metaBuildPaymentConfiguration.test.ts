import { mocked } from 'jest-mock';
import { getPublicOrderId } from '@boldcommerce/checkout-frontend-library';
import { metaBuildPaymentConfiguration } from 'src/themes/flow-sdk/meta';
import { IMetaPaymentConfiguration } from 'src/themes/flow-sdk/types';
import { checkoutFlow } from 'src/themes/flow-sdk/flowState';
import { MetaPaymentConfiguration } from 'src/themes/flow-sdk/mocks/paymentMocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/auth/getPublicOrderId')
jest.mock('src/themes/flow-sdk/flowState')

const getPublicOrderIdMock = mocked(getPublicOrderId, true);
const checkoutFlowMock = mocked(checkoutFlow, true);
const publicOrderID = 'publicOrderId'

describe('metaBuildPaymentConfiguration', () => {
    it('should build the payment configuration', () => {
        const metaPaymentConfiguration: IMetaPaymentConfiguration = {
            acquirerCountryCode: 'US',
            containerContext: MetaPaymentConfiguration.containerContext,
            requestId: MetaPaymentConfiguration.requestId,
            mode: 'LIVE',
            partnerId: "",
            partnerMerchantId: "",
            supportedContainers: MetaPaymentConfiguration.supportedContainers,
            uxFlags: MetaPaymentConfiguration.uxFlags,
        }

        getPublicOrderIdMock.mockReturnValue(publicOrderID);
        expect(metaBuildPaymentConfiguration()).toEqual(metaPaymentConfiguration);
    });

    it('should build the payment configuration with test mode', () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }

        getPublicOrderIdMock.mockReturnValue(publicOrderID);
        expect(metaBuildPaymentConfiguration()).toEqual(MetaPaymentConfiguration);
    });

});