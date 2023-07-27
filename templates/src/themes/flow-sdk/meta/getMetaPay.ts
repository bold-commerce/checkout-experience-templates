import {IMetaPay} from 'src/themes/flow-sdk/types';
import {metaFlow} from 'src/themes/flow-sdk/flowState';
import {MetaNullStateKeyError} from 'src/themes/flow-sdk/errors';

export const MetaPayNullStateError = new MetaNullStateKeyError('Precondition violated: metaPay is null');

export const getMetaPay = (): IMetaPay => {
    if (!metaFlow.metaPay) {
        throw MetaPayNullStateError;
    }
    return metaFlow.metaPay;
};