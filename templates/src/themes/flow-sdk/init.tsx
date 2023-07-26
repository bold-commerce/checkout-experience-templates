import * as BugReporter from 'src/utils/bugReporter';
import {
    initialize as initializeFrontendLibrary,
    IInitializeOrderResponse,
} from '@boldcommerce/checkout-frontend-library';
import {flowType} from 'src/themes/flow-sdk/constants';
import {initMetaFlow} from 'src/themes/flow-sdk/meta';
import {setCheckoutFlow} from 'src/themes/flow-sdk/manageFlowState';
import {ICheckoutFlowParameters} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {FlowError} from 'src/themes/flow-sdk/errors';

BugReporter.init('flow-sdk');

const initFlow = async (initialData: IInitializeOrderResponse, params: ICheckoutFlowParameters ): Promise<void> => {
    const {flow_settings: flowSettings} = initialData.initial_data;
    const {params: {shopIdentifier, environment}} = setCheckoutFlow(params, flowSettings);

    await initializeFrontendLibrary(initialData, shopIdentifier, environment);

    if (flowSettings) {
        switch (flowSettings.flow_type) {
            case flowType.META:
                return await initMetaFlow();
            default:
                logger(`Invalid Flow Type: ${flowSettings.flow_type}`, 'error', true);
                return Promise.reject();
        }
    }
};

const canCheckoutWithFlow = (): boolean => {
    return checkoutFlow.canCheckout;
};

const onCheckoutClick = (): void => {
    if (checkoutFlow.canCheckout && typeof checkoutFlow.onCheckoutClick === 'function') {
        checkoutFlow.onCheckoutClick();
    } else {
        throw new FlowError('Flow not capable to trigger checkout.');
    }
};

window.bold = {
    ...window.bold,
    initFlow,
    canCheckoutWithFlow,
    onCheckoutClick,
};
