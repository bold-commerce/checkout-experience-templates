import { mocked } from 'jest-mock';
import { checkoutFlow } from 'src/themes/flow-sdk/flowState';
import { getMetaPaymentClient, metaRenderButton } from 'src/themes/flow-sdk/meta';
import { logger } from 'src/themes/flow-sdk/logger';
import { MetaPaymentClientMock } from 'src/themes/flow-sdk/mocks/paymentMocks';


jest.mock('src/themes/flow-sdk/meta/getMetaPaymentClient')
jest.mock('src/themes/flow-sdk/flowState')
jest.mock('src/themes/flow-sdk/logger')
jest.mock('src/themes/flow-sdk/meta/metaBuildPaymentRequest')
jest.mock('src/themes/flow-sdk/meta/metaOnResponse')

const getMetaPaymentClientMock = mocked(getMetaPaymentClient, true);
const checkoutFlowMock = mocked(checkoutFlow, true);
const loggerMock = mocked(logger, true);

describe('metaRenderButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render button', async () => {
        checkoutFlowMock.canCheckout = false
        await expect(metaRenderButton()).rejects.toBeUndefined();

        expect(loggerMock).toHaveBeenCalled();
    });


    it('renders button', async () => {
        getMetaPaymentClientMock.mockReturnValue(MetaPaymentClientMock);

        checkoutFlowMock.canCheckout = true
        await expect(metaRenderButton()).resolves.toBeUndefined();
    });
});