import {getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';


export const metaRenderButton = async (): Promise<void> => {
    if (checkoutFlow.canCheckout) {
        return await getMetaPaymentClient().renderButton(`#${checkoutFlow.params.flowElementId}`, metaBuildPaymentRequest, metaOnResponse, {theme: 'dark'});
    } else {
        logger('Button was not rendered. Meta Flow is not AVAILABLE', 'error');
        return Promise.reject();
    }
};