import {IMetaPaymentAuthorizationResult, IMetaPaymentResponse} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';

export function metaOnPaymentConsent(paymentResponse: IMetaPaymentResponse): Promise<IMetaPaymentAuthorizationResult> {
    logger(`metaOnPaymentConsent PaymentResponse: ${JSON.stringify(paymentResponse, undefined, 4)}`, 'info');
    const paymentAuthorizationResult: IMetaPaymentAuthorizationResult = {authorizationState: 'SUCCESS'};

    //TODO Process the Order

    logger(`Meta PaymentAuthorizationResult: ${JSON.stringify(paymentAuthorizationResult, undefined, 4)}`, 'info');
    return Promise.resolve(paymentAuthorizationResult);
}
