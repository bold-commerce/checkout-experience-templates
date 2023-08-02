import {IMetaPaymentClient, IMetaPaymentRequest,} from 'src/themes/flow-sdk/types';
import {getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse} from 'src/themes/flow-sdk/meta';

export async function metaOnCheckoutClickEvent(): Promise<void> {
    const paymentClient: IMetaPaymentClient = getMetaPaymentClient();
    const paymentRequest: IMetaPaymentRequest = metaBuildPaymentRequest();

    await metaOnResponse(paymentClient.getPaymentResponse(paymentRequest));
}
