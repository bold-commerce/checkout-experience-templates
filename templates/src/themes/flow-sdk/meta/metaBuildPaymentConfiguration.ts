import {getPublicOrderId} from '@boldcommerce/checkout-frontend-library';
import {IMetaFlowSettings, IMetaPaymentConfiguration, IMetaPaymentMode} from 'src/themes/flow-sdk/types';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {logger} from 'src/themes/flow-sdk/logger';

export const metaBuildPaymentConfiguration = (): IMetaPaymentConfiguration => {
    const {is_test_mode: isTest, partner_id: partnerId = '', partner_merchant_id: partnerMerchantId = ''} = checkoutFlow.flow_settings as IMetaFlowSettings;
    const mode: IMetaPaymentMode = isTest ? 'TEST' : 'LIVE';
    const publicOrderId = getPublicOrderId();

    const paymentConfiguration: IMetaPaymentConfiguration = {
        mode,
        partnerId,
        partnerMerchantId,
        acquirerCountryCode: 'US',
        supportedContainers: {
            'basic-card-v1': {requireCVV: true},
            'ecom-token-v1': {},
        },
        containerContext: publicOrderId,
        requestId: publicOrderId,
        uxFlags: ['META_CHECKOUT'],
    };

    logger({paymentConfiguration}, 'info');

    return paymentConfiguration;
};
