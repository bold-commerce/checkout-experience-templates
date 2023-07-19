import {IMetaPay} from 'src/themes/flow-sdk/types';
import {metaFlow} from 'src/themes/flow-sdk/flowState';
import {MetaNullStateKeyError} from 'src/themes/flow-sdk/errors';

export function getMetaPay(): IMetaPay {
    if (!metaFlow.metaPay) {
        throw new MetaNullStateKeyError('Precondition violated: metaPay is null');
    }
    return metaFlow.metaPay;
}