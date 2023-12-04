import {
    metaCheckAvailability,
    metaInitPaymentClient,
    metaOnCheckoutClickEvent,
    metaRenderButton,
} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow, metaFlow} from 'src/themes/flow-sdk/flowState';
import {FlowError} from 'src/themes/flow-sdk/errors';
import {addLog, getPublicOrderId} from '@boldcommerce/checkout-frontend-library';
import {ADD_LOG_DETAILS_MAX_SIZE, ADD_LOG_MESSAGE_MAX_SIZE} from 'src/themes/flow-sdk/constants';

export const CheckAvailabilityError = 'Fail to check Meta Availability';
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

    try {
        metaFlow.metaPay = window.metapay;

        metaInitPaymentClient();
        await metaCheckAvailability();
    } catch (e) {
        const message = e instanceof Error ? e.message : (typeof e === 'string' ? e : CheckAvailabilityError);
        if (checkoutFlow.params.onAction && typeof checkoutFlow.params.onAction === 'function') {
            checkoutFlow.params.onAction('FLOW_INITIALIZE', {success: false, error: e});
        }
        logger(message, 'error', true);
        addLog(
            `META_CHECKOUT ${message}`.slice(0, ADD_LOG_MESSAGE_MAX_SIZE),
            '',
            JSON.stringify(e).slice(0, ADD_LOG_DETAILS_MAX_SIZE)
        );
        return Promise.reject(e);
    }

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
