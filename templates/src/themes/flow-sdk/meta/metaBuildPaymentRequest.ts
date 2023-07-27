import {IMetaPaymentRequest} from 'src/themes/flow-sdk/types';
import {metaBuildPaymentConfiguration, metaBuildPaymentDetails, metaBuildPaymentOptions} from 'src/themes/flow-sdk/meta';

export const metaBuildPaymentRequest = (): IMetaPaymentRequest => {
    return {
        paymentConfiguration: metaBuildPaymentConfiguration(),
        paymentDetails: metaBuildPaymentDetails(),
        paymentOptions: metaBuildPaymentOptions(),
    };
};
