import {IMetaPaymentClient, IMetaThemeOptions} from 'src/themes/flow-sdk/types';
import {getMetaPaymentClient, metaBuildPaymentRequest, metaOnResponse} from 'src/themes/flow-sdk/meta';
import {logger} from 'src/themes/flow-sdk/logger';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export async function metaRenderButton(): Promise<void> {
    const paymentClient: IMetaPaymentClient = getMetaPaymentClient();
    const {params: {flowElementId}, canCheckout} = checkoutFlow;
    const themeOptions: IMetaThemeOptions = {theme: 'dark'};

    if (canCheckout) {
        return await paymentClient.renderButton(`#${flowElementId}`, metaBuildPaymentRequest, metaOnResponse, themeOptions);
    } else {
        logger('Button was not rendered. Meta Flow is not AVAILABLE', 'error');
        return Promise.reject();
    }
}
