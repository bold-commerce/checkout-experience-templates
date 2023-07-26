import {IMetaPaymentClient, IMetaPaymentRequest,} from 'src/themes/flow-sdk/types';
import {getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';

export async function metaOnCheckoutClickEvent(): Promise<void> {
    const paymentClient: IMetaPaymentClient = getMetaPaymentClient();
    const paymentRequest: IMetaPaymentRequest = metaBuildPaymentRequest();
    logger(`Meta PaymentRequest: ${JSON.stringify(paymentRequest, undefined, 4)}`, 'info');

    await metaOnResponse(paymentClient.getPaymentResponse(paymentRequest));
}
