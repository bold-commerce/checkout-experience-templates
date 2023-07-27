import { getMetaPaymentClient, MetaPaymentClienNullStatError } from 'src/themes/flow-sdk/meta/getMetaPaymentClient';
import { metaFlow } from 'src/themes/flow-sdk/flowState';
import { MetaPaymentClientMock } from 'src/themes/flow-sdk/mocks/paymentMocks';

describe('getMetaPaymentClient', () => {
    afterEach(() => {
        metaFlow.metaPaymentClient = null;
    });

    it('should throw MetaNullStateKeyError if metaPaymentClient is null', () => {
        expect(() => getMetaPaymentClient()).toThrowError(MetaPaymentClienNullStatError);
    });

    it('should return the metaPaymentClient object if it is not null', () => {
        metaFlow.metaPaymentClient = MetaPaymentClientMock;
        expect(getMetaPaymentClient()).toBe(MetaPaymentClientMock);
    });
});