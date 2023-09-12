import {
    metaCheckAvailability,
    metaInitPaymentClient,
    metaOnCheckoutClickEvent,
    metaRenderButton,
} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow, metaFlow} from 'src/themes/flow-sdk/flowState';
import {FlowError} from 'src/themes/flow-sdk/errors';

export const MissingMetapayObjectError = 'Missing "metapay" object in window';

export const metaOnLoadScript = async (): Promise<void> => {
    if (!window.metapay) {
        logger(MissingMetapayObjectError, 'error', true);
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_INITIALIZE', {success: false, error: new FlowError(MissingMetapayObjectError)});
        }
        return Promise.reject(MissingMetapayObjectError);
    }

    metaFlow.metaPay = window.metapay;

    metaInitPaymentClient();
    await metaCheckAvailability();

    if (checkoutFlow.params.flowElementId) {
        const promise = await metaRenderButton();
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_INITIALIZE', {success: true});
        }
        return promise;
    } else {
        logger('Empty flowElementId, use canCheckoutWithFlow and onCheckoutClick to trigger the flow', 'info');
        checkoutFlow.onCheckoutClick = metaOnCheckoutClickEvent;
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_INITIALIZE', {success: true});
        }
        return Promise.resolve();
    }
};
