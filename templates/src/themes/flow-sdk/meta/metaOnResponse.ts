import {IMetaPaymentError, IMetaPaymentResponse} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export const metaOnResponse = async (responsePromise: Promise<IMetaPaymentResponse>): Promise<void> => {
    try {
        await responsePromise; // Just watch responsePromise from metapay for any PaymentError.
    } catch (err) {
        const error = err as IMetaPaymentError;
        switch (error.code) {
            case 'ABORTED': {
                if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
                    checkoutFlow.params.onAction('FLOW_ABORTED', error);
                }
                logger(`Flow was ended with code: ${error.code}`, 'log', true);
                break;
            }
            case 'DISMISSED_FOR_SESSION': {
                if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
                    checkoutFlow.params.onAction('FLOW_DISMISSED', error);
                }
                logger(`Flow was ended with code: ${error.code}`, 'log', true);
                break;
            }
            default: {
                if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
                    checkoutFlow.params.onAction('FLOW_ERROR', error);
                }
                logger(`Flow error code: ${error.code} - message: ${error.message}`, 'error');
            }
        }
    }
};
