import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {ICheckoutFlow, ICheckoutFlowParameters} from 'src/themes/flow-sdk/types';

export function setCheckoutFlow(params: ICheckoutFlowParameters, flowSetting: Record<string, unknown>): ICheckoutFlow {
    const environment = params.environment || window.environment || {type: 'production'};
    const sptUrlByEnvironment = environment.type === 'staging' ? 'https://secure.staging.boldcommerce.com' : 'https://secure.boldcommerce.com';
    checkoutFlow.params = {
        boldSecureUrl: params.boldSecureUrl || sptUrlByEnvironment,
        environment: environment,
        flowElementId: params.flowElementId || '',
        shopIdentifier: params.shopIdentifier,
        onAction: params.onAction || null,
    };
    checkoutFlow.flow_settings = flowSetting;

    return checkoutFlow;
}
