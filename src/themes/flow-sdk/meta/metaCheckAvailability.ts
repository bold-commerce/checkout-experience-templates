import {
    IMetaAvailability,
    IMetaPaymentClient,
    IMetaPaymentConfiguration,
} from 'src/themes/flow-sdk/types';
import {getMetaPaymentClient, metaBuildPaymentConfiguration} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export async function metaCheckAvailability(): Promise<void> {
    const paymentClient: IMetaPaymentClient = getMetaPaymentClient();
    const paymentConfiguration: IMetaPaymentConfiguration = metaBuildPaymentConfiguration();

    const availability: IMetaAvailability = await paymentClient.getAvailability(paymentConfiguration);
    checkoutFlow.canCheckout = (availability === 'AVAILABLE');

    logger(`Meta Availability: ${availability}`, 'info');
}
