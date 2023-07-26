import {IMetaPaymentClient} from 'src/themes/flow-sdk/types';
import {metaFlow} from 'src/themes/flow-sdk/flowState';
import {MetaNullStateKeyError} from 'src/themes/flow-sdk/errors';

export function getMetaPaymentClient(): IMetaPaymentClient {
    if (!metaFlow.metaPaymentClient) {
        throw new MetaNullStateKeyError('Precondition violated: metaPaymentClient is null');
    }
    return metaFlow.metaPaymentClient;
}