import {getMetaPaymentClient, metaBuildPaymentConfiguration} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {addLog, patchOrderMetaData} from '@boldcommerce/checkout-frontend-library';
import {baseMetadataRequest} from 'src/themes/flow-sdk/constants';

export const metaCheckAvailability = async (): Promise<void> => {
    const paymentClient = getMetaPaymentClient();
    const paymentConfiguration = metaBuildPaymentConfiguration();

    if (paymentConfiguration?.requestId && paymentConfiguration?.containerContext) {
        const availability = await paymentClient.getAvailability(paymentConfiguration);
        checkoutFlow.canCheckout = (availability === 'AVAILABLE');
        logger(`Meta Availability: ${availability}`, 'info');
        addLog(`META_CHECKOUT availability check: ${availability}`);
        const tags = [`meta_availability:${availability}`];
        if (window.fbq && typeof window.fbq === 'function') {
            const fbqState = window.fbq.getState();
            const pixelId = fbqState.pixels.map(p => p.id).join(';');
            pixelId && tags.push(`pixel_id:${pixelId}`);
        }
        await patchOrderMetaData({...baseMetadataRequest, tags});
    } else {
        const message = 'No requestId and containerContext in PaymentConfiguration to check availability';
        addLog(`META_CHECKOUT ${message}`);
        logger(message, 'error');
    }
};
