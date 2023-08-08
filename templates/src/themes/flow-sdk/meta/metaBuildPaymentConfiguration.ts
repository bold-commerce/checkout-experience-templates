import {getPublicOrderId} from '@boldcommerce/checkout-frontend-library';
import {IMetaFlowSettings, IMetaPaymentConfiguration, IMetaPaymentMode} from 'src/themes/flow-sdk/types';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export const metaBuildPaymentConfiguration = (): IMetaPaymentConfiguration => {
    const {is_test_mode: isTest, partner_id: partnerId = '', partner_merchant_id: partnerMerchantId = ''} = checkoutFlow.flow_settings as IMetaFlowSettings;
    const mode: IMetaPaymentMode = isTest ? 'TEST' : 'LIVE';

    return {
        mode,
        partnerId,
        partnerMerchantId,
        acquirerCountryCode: 'US',
        supportedContainers: {
            'basic-card-v1': {},
            'ecom-token-v1': {},
        },
        containerContext: getPublicOrderId(), //TODO Using the public order id. Unique id for the payment, what should this be at this point?
        uxFlags: ['META_CHECKOUT'], //TODO Should we use 'DISABLE_PROACTIVE_CHECKOUT' too?
    };
};
