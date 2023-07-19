import {IMetaPaymentError, IMetaPaymentResponse} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {metaFlow} from 'src/themes/flow-sdk/flowState';

export async function metaOnResponse(responsePromise: Promise<IMetaPaymentResponse>): Promise<void> {
    logger(`metaOnResponse PaymentResponse: ${JSON.stringify(responsePromise, undefined, 4)}`, 'info');

    try {
        const response = await responsePromise;
        logger(`Meta PaymentResponse response: ${JSON.stringify(response, undefined, 4)}`, 'info');
        //TODO Implement OnResponse Event
    } catch (err) {
        logger(`Meta PaymentResponse error: ${JSON.stringify(err, undefined, 4)}`, 'error');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (err instanceof metaFlow.metaPay?.PaymentError) {
            const error = err as IMetaPaymentError;
            switch (error.code) {
                case 'ABORTED': //TODO: execute callback informing that the Meta Checkout was dismissed
                case 'DISMISSED_FOR_SESSION': //TODO: execute callback informing to proceed to normal checkout
                    logger(`Flow was ended with code: ${error.code}`, 'log', true);
                    break;
                default:
                    logger(`Flow error code: ${error.code} - message: ${error.message}`, 'error');
                    throw error;
            }
        }
    }
}
