import {getMetaPaymentClient, metaBuildPaymentConfiguration} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {addLog, patchOrderMetaData} from '@boldcommerce/checkout-frontend-library';
import {ADD_LOG_MESSAGE_MAX_SIZE, baseMetadataRequest} from 'src/themes/flow-sdk/constants';
import {isFbqGetStateAvailable} from 'src/themes/flow-sdk/flow-utils/isFbqGetStateAvailable';

export const metaCheckAvailability = async (): Promise<void> => {
    const paymentClient = getMetaPaymentClient();
    const paymentConfiguration = metaBuildPaymentConfiguration();

    if (paymentConfiguration?.requestId && paymentConfiguration?.containerContext) {
        const availability = await paymentClient.getAvailability(paymentConfiguration);
        checkoutFlow.canCheckout = (availability === 'AVAILABLE');
        logger(`Meta Availability: ${availability}`, 'info');
        addLog(`META_CHECKOUT availability check: ${availability}`);
        const tags = [`meta_availability:${availability}`];
        if (isFbqGetStateAvailable()) {
            const fbqState = window?.fbq?.getState();
            const pixelId = fbqState?.pixels.map(p => p.id).join(';');
            pixelId && tags.push(`pixel_id:${pixelId}`);
        }
        await patchOrderMetaData({...baseMetadataRequest, tags});
    } else {
        const message = 'No requestId and containerContext in PaymentConfiguration to check availability';
        addLog(`META_CHECKOUT ${message}`.slice(0, ADD_LOG_MESSAGE_MAX_SIZE));
        logger(message, 'error');
    }
};
