import {IMetaPaymentError, IMetaPaymentResponse} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {onBeforeUnload} from 'src/themes/flow-sdk/flow-utils/onBeforeUnload';
import {addLog} from '@boldcommerce/checkout-frontend-library';
import {ADD_LOG_DETAILS_MAX_SIZE, ADD_LOG_MESSAGE_MAX_SIZE} from 'src/themes/flow-sdk/constants';

export const metaOnResponse = async (responsePromise: Promise<IMetaPaymentResponse>): Promise<void> => {
    try {
        window.onbeforeunload = onBeforeUnload;
        await responsePromise; // Just watch responsePromise from metapay for any PaymentError.
        window.onbeforeunload = null;
    } catch (err) {
        window.onbeforeunload = null;
        const error = err as IMetaPaymentError;
        addLog(
            `META_CHECKOUT META ERROR code: ${error.code} message:${error.message}`.slice(0, ADD_LOG_MESSAGE_MAX_SIZE),
            '',
            JSON.stringify(error).slice(0, ADD_LOG_DETAILS_MAX_SIZE)
        );
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
