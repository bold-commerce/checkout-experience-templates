import {getMetaPaymentClient, metaBuildPaymentConfiguration} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {addLog} from '@boldcommerce/checkout-frontend-library';

export const metaCheckAvailability = async (): Promise<void> => {
    const paymentClient = getMetaPaymentClient();
    const paymentConfiguration = metaBuildPaymentConfiguration();

    if (paymentConfiguration?.requestId && paymentConfiguration?.containerContext) {
        const availability = await paymentClient.getAvailability(paymentConfiguration);
        checkoutFlow.canCheckout = (availability === 'AVAILABLE');
        logger(`Meta Availability: ${availability}`, 'info');
        addLog(`META_CHECKOUT availability check: ${availability}`);
    } else {
        const message = 'No requestId and containerContext in PaymentConfiguration to check availability';
        addLog(`META_CHECKOUT ${message}`);
        logger(message, 'error');
    }
};
