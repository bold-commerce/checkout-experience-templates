import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {ICheckoutFlow, ICheckoutFlowParameters} from 'src/themes/flow-sdk/types';

export function setCheckoutFlow(params: ICheckoutFlowParameters, flowSetting: Record<string, unknown>): ICheckoutFlow {
    checkoutFlow.params = {
        boldSecureUrl: params.boldSecureUrl || 'https://secure.boldcommerce.com',
        environment: params.environment || window.environment || {type: 'production'},
        flowElementId: params.flowElementId || '',
        shopIdentifier: params.shopIdentifier,
        onAction: params.onAction || null,
    };
    checkoutFlow.flow_settings = flowSetting;

    return checkoutFlow;
}
