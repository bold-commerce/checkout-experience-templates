import { mocked } from 'jest-mock';
import { metaBuildPaymentConfiguration, metaBuildPaymentDetails, metaBuildPaymentOptions, metaBuildPaymentRequest } from 'src/themes/flow-sdk/meta';
import { MetaPaymentOptionsMock, MetaPaymentDetailsMock, MetaPaymentConfiguration } from 'src/themes/flow-sdk/mocks/paymentMocks';

jest.mock('src/themes/flow-sdk/meta/metaBuildPaymentConfiguration');
jest.mock('src/themes/flow-sdk/meta/metaBuildPaymentDetails');
jest.mock('src/themes/flow-sdk/meta/metaBuildPaymentOptions');

const metaBuildPaymentConfigurationMock = mocked(metaBuildPaymentConfiguration, true);
const metaBuildPaymentDetailsMock = mocked(metaBuildPaymentDetails, true);
const metaBuildPaymentOptionsMock = mocked(metaBuildPaymentOptions, true);

describe('metaBuildPaymentRequest', () => {
    it('should return an object with paymentConfiguration, paymentDetails, and paymentOptions properties', () => {
        metaBuildPaymentConfigurationMock.mockReturnValue(MetaPaymentConfiguration);
        metaBuildPaymentDetailsMock.mockReturnValue(MetaPaymentDetailsMock)
        metaBuildPaymentOptionsMock.mockReturnValue(MetaPaymentOptionsMock);

        const result = {
            paymentConfiguration: MetaPaymentConfiguration,
            paymentDetails: MetaPaymentDetailsMock,
            paymentOptions: MetaPaymentOptionsMock,
        }

        expect(metaBuildPaymentRequest()).toEqual(result);
    });
});