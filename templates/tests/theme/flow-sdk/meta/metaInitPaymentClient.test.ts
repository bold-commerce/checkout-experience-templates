import { mocked } from 'jest-mock';
import { getMetaPay, metaInitPaymentClient } from 'src/themes/flow-sdk/meta'

jest.mock('src/themes/flow-sdk/meta/getMetaPay')

const getMetaPayMock = mocked(getMetaPay, true);

describe('metaInitPaymentClient', () => {

    it('should call getMetaPay', () => {
        getMetaPayMock.mockReturnValue({
            PaymentClient: Object.assign(jest.fn(), { message: "Some Message" }),
            PaymentError: Object.assign(jest.fn(), { message: "Some Error Message" })
        });

        metaInitPaymentClient()

        expect(getMetaPayMock).toHaveBeenCalled();
    });
})
