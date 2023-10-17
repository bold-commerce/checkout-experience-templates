import {
    metaCheckAvailability,
    metaInitPaymentClient,
    metaOnCheckoutClickEvent,
    metaRenderButton,
} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow, metaFlow} from 'src/themes/flow-sdk/flowState';
import {FlowError} from 'src/themes/flow-sdk/errors';
import {getPublicOrderId} from '@boldcommerce/checkout-frontend-library';

export const MissingMetapayObjectError = 'Missing "metapay" object in window';
export const MissingPublicOrderIdError = 'Missing "public_order_id" in the provided order';

export const metaOnLoadScript = async (): Promise<void> => {
    if (!window.metapay || !getPublicOrderId()) {
        const message = !window.metapay ? MissingMetapayObjectError : MissingPublicOrderIdError;
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_INITIALIZE', {success: false, error: new FlowError(message)});
        }
        logger(message, 'error', true);
        return Promise.reject(message);
    }

    metaFlow.metaPay = window.metapay;

    metaInitPaymentClient();
    await metaCheckAvailability();

    // If we can't checkout no need to proceed
    if (!checkoutFlow.canCheckout) {
        const metaFlowNotAvailable = 'Meta checkout flow not available';
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_INITIALIZE', {success: false, error: new FlowError(metaFlowNotAvailable)});
        }
        return Promise.reject(metaFlowNotAvailable);
    }

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
