import { mocked } from 'jest-mock';
import { metaOnResponse } from 'src/themes/flow-sdk/meta/metaOnResponse';
import { checkoutFlow } from 'src/themes/flow-sdk/flowState';
import { IMetaPaymentResponse, IMetaPaymentError, IOnAction } from 'src/themes/flow-sdk/types';
import { logger } from 'src/themes/flow-sdk/logger';


jest.mock('src/themes/flow-sdk/logger')
const checkoutFlowMock = mocked(checkoutFlow, true);
const loggerMock = mocked(logger, true);



describe('metaOnResponse', () => {
    beforeEach(() => {
        // @ts-ignore - we don't need to mock all the properties
        checkoutFlowMock.params.onAction = jest.fn() as IOnAction;
    });


    it('metaOnResponse', async () => {
        var resp: IMetaPaymentResponse = {
            requestId: "123",
            container: {
                mode: 'TEST',
                containerId: '123',
                containerType: 'basic-card-v1',
                containerData: '123'
            },
            containerDescription: '123',
        }

        await metaOnResponse(Promise.resolve(resp));
    });

    it('metaFlow metapay payment error ABORTED, FLOW ABORTED', async () => {
        const error: IMetaPaymentError = {
            code: 'ABORTED',
            message: 'Payment was aborted',
        };
        const responsePromise: Promise<IMetaPaymentResponse> = Promise.reject(error);
        await metaOnResponse(responsePromise);

        expect(checkoutFlowMock.params.onAction).toHaveBeenCalledWith('FLOW_ABORTED', error);
        expect(loggerMock).toBeCalled();
    });

    it('metaFlow metapay payment error DISMISSED_FOR_SESSION, FLOW_DISMISSED', async () => {
        const error: IMetaPaymentError = {
            code: 'DISMISSED_FOR_SESSION',
            message: 'Payment was dismissed',
        };
        const responsePromise: Promise<IMetaPaymentResponse> = Promise.reject(error);
        await metaOnResponse(responsePromise);

        expect(checkoutFlowMock.params.onAction).toHaveBeenCalledWith('FLOW_DISMISSED', error);
        expect(loggerMock).toBeCalled();
    });

    it('metaFlow metapay payment error DEFAULT, FLOW_ERROR', async () => {
        const error: IMetaPaymentError = {
            code: 'DEFAULT',
            message: 'Payment was dismissed',
        };
        const responsePromise: Promise<IMetaPaymentResponse> = Promise.reject(error);
        await metaOnResponse(responsePromise);

        expect(checkoutFlowMock.params.onAction).toHaveBeenCalledWith('FLOW_ERROR', error);
        expect(loggerMock).toBeCalled();
    });
});