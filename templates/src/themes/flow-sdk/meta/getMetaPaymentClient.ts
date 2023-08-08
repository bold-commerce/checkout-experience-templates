import {IMetaPaymentClient} from 'src/themes/flow-sdk/types';
import {metaFlow} from 'src/themes/flow-sdk/flowState';
import {MetaNullStateKeyError} from 'src/themes/flow-sdk/errors';

export const MetaPaymentClienNullStatError = new MetaNullStateKeyError('Precondition violated: metaPaymentClient is null');

export const getMetaPaymentClient = (): IMetaPaymentClient => {
    if (!metaFlow.metaPaymentClient) {
        throw MetaPaymentClienNullStatError;
    }
    return metaFlow.metaPaymentClient;
};