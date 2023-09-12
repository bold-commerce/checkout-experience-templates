import {getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse} from 'src/themes/flow-sdk/meta';

export const metaOnCheckoutClickEvent = async (): Promise<void> => {
    const paymentClient = getMetaPaymentClient();
    const paymentRequest = metaBuildPaymentRequest();

    await metaOnResponse(paymentClient.getPaymentResponse(paymentRequest));
};
