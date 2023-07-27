import {
    metaCheckAvailability,
    metaInitPaymentClient,
    metaOnCheckoutClickEvent,
    metaRenderButton,
} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow, metaFlow} from 'src/themes/flow-sdk/flowState';

export const MissingMetapayObjectError = 'Missing "metapay" object in window';

export const metaOnLoadScript = async (): Promise<void> => {
    if (!window.metapay) {
        logger(MissingMetapayObjectError, 'error', true);
        return Promise.reject(MissingMetapayObjectError);
    }

    metaFlow.metaPay = window.metapay;

    metaInitPaymentClient();
    await metaCheckAvailability();

    if (checkoutFlow.params.flowElementId) {
        return await metaRenderButton();
    } else {
        logger('Empty flowElementId, use canCheckoutWithFlow and onCheckoutClick to trigger the flow', 'info');
        checkoutFlow.onCheckoutClick = metaOnCheckoutClickEvent;
        return Promise.resolve();
    }
};
