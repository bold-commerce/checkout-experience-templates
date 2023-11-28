import {getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {addLog, patchOrderMetaData} from '@boldcommerce/checkout-frontend-library';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {FlowError} from 'src/themes/flow-sdk/errors';
import {baseMetadataRequest} from 'src/themes/flow-sdk/constants';

export const metaOnCheckoutClickEvent = async (): Promise<void> => {
    const paymentClient = getMetaPaymentClient();
    const paymentRequest = metaBuildPaymentRequest();

    await patchOrderMetaData({...baseMetadataRequest, tags: ['checkout_button_clicked']});
    if (paymentRequest?.paymentConfiguration?.requestId && paymentRequest?.paymentConfiguration?.containerContext) {
        await metaOnResponse(paymentClient.getPaymentResponse(paymentRequest));
    } else {
        const message = 'No requestId and containerContext in PaymentConfiguration for checkout on click';
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            const error = new FlowError(message);
            checkoutFlow.params.onAction('FLOW_ERROR', error);
        }
        addLog(`META_CHECKOUT ${message}`);
        logger(message, 'error');
    }
};
