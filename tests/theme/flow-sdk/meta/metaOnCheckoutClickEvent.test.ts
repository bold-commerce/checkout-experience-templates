import { mocked } from 'jest-mock';
import { metaOnCheckoutClickEvent, getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse } from 'src/themes/flow-sdk/meta'
import {
    MetaPaymentClientMock,
    MetaPaymentConfiguration,
    MetaPaymentDetailsMock, MetaPaymentOptionsMock
} from 'src/themes/flow-sdk/mocks/paymentMocks';

jest.mock('src/themes/flow-sdk/meta/getMetaPaymentClient');
jest.mock('src/themes/flow-sdk/meta/metaBuildPaymentRequest');
jest.mock('src/themes/flow-sdk/meta/metaOnResponse');

const getMetaPaymentClientMock = mocked(getMetaPaymentClient, true);
const metaBuildPaymentRequestMock = mocked(metaBuildPaymentRequest, true);
const metaOnResponseMock = mocked(metaOnResponse, true);

describe('metaOnCheckoutClickEvent', () => {
    beforeAll(() => {
        getMetaPaymentClientMock.mockReturnValue(MetaPaymentClientMock);
        metaBuildPaymentRequestMock.mockReturnValue({
            paymentConfiguration: MetaPaymentConfiguration,
            paymentDetails: MetaPaymentDetailsMock,
            paymentOptions: MetaPaymentOptionsMock,
        });
    });

    it('should call getMetaPaymentClient and metaBuildPaymentRequest', async () => {
        await metaOnCheckoutClickEvent();

        expect(getMetaPaymentClientMock).toHaveBeenCalled();
        expect(metaBuildPaymentRequestMock).toHaveBeenCalled();
        expect(metaOnResponseMock).toHaveBeenCalled();
    });
})