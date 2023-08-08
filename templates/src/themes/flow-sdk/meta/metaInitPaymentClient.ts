import {getMetaPay, metaOnPaymentConsent, metaOnPaymentDetailsChanged} from 'src/themes/flow-sdk/meta';
import {META_CLIENT_VERSION} from 'src/themes/flow-sdk/constants';
import {metaFlow} from 'src/themes/flow-sdk/flowState';

export const metaInitPaymentClient = (): void => {
    const {PaymentClient} = getMetaPay();
    metaFlow.metaPaymentClient = new PaymentClient(META_CLIENT_VERSION);
    metaFlow.metaPaymentClient.onPaymentDetailsChanged = metaOnPaymentDetailsChanged;
    metaFlow.metaPaymentClient.onPaymentConsent = metaOnPaymentConsent;
};
