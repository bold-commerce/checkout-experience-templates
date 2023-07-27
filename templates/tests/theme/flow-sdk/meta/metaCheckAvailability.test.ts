import { mocked } from 'jest-mock';
import { getMetaPaymentClient, metaBuildPaymentConfiguration, metaCheckAvailability } from 'src/themes/flow-sdk/meta'
import { MetaPaymentClientMock, MetaPaymentConfiguration } from 'src/themes/flow-sdk/mocks/paymentMocks';
import { logger } from 'src/themes/flow-sdk/logger';

jest.mock('src/themes/flow-sdk/meta/getMetaPaymentClient')
jest.mock('src/themes/flow-sdk/meta/metaBuildPaymentConfiguration')
jest.mock('src/themes/flow-sdk/logger')

const getMetaPaymentClientMock = mocked(getMetaPaymentClient, true);
const metaBuildPaymentConfigurationMock = mocked(metaBuildPaymentConfiguration, true);
const loggerMock = mocked(logger, true);


describe('metaCheckAvailability', () => {
    beforeAll(() => {
        getMetaPaymentClientMock.mockReturnValue(MetaPaymentClientMock);
        metaBuildPaymentConfigurationMock.mockReturnValue(MetaPaymentConfiguration);
    });

    it('should call getMetaPaymentClient and metaBuildPaymentRequest', async () => {
        await metaCheckAvailability();

        expect(getMetaPaymentClientMock).toHaveBeenCalled();
        expect(metaBuildPaymentConfigurationMock).toHaveBeenCalled();
        expect(loggerMock).toHaveBeenCalled();
    });
})