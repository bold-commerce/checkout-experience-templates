import {getMetaPaymentClient, metaBuildPaymentConfiguration} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export const metaCheckAvailability = async (): Promise<void> => {
    const paymentClient = getMetaPaymentClient();
    const paymentConfiguration = metaBuildPaymentConfiguration();

    const availability = await paymentClient.getAvailability(paymentConfiguration);
    checkoutFlow.canCheckout = (availability === 'AVAILABLE');

    logger(`Meta Availability: ${availability}`, 'info');
};
