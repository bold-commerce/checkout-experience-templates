import {
    metaCheckAvailability,
    metaInitPaymentClient,
    metaOnCheckoutClickEvent,
    metaRenderButton,
} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow, metaFlow} from 'src/themes/flow-sdk/flowState';

export async function metaOnLoadScript(): Promise<void> {
    const {params: {flowElementId}} = checkoutFlow;

    if (!window.metapay) {
        const message = 'Missing "metapay" object in window';
        logger(message, 'error', true);
        return Promise.reject(message);
    }

    metaFlow.metaPay = window.metapay;

    metaInitPaymentClient();
    await metaCheckAvailability();

    if (flowElementId) {
        return metaRenderButton();
    } else {
        logger('Empty flowElementId, use canCheckoutWithFlow and onCheckoutClick to trigger the flow', 'info');
        checkoutFlow.onCheckoutClick = metaOnCheckoutClickEvent;
        return Promise.resolve();
    }
}
