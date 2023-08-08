import {IMetaPaymentOptions} from 'src/themes/flow-sdk/types';
import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';

export const metaBuildPaymentOptions = (): IMetaPaymentOptions => {
    return {
        allowOfferCodes: false,
        requestBillingAddress: true,
        requestPayerEmail: true,
        requestPayerPhone: getOrderInitialData().general_settings.checkout_process.phone_number_required,
        requestShipping: true,
        billingAddressMode: 'FULL',
        fulfillmentType: 'SHIPPING'
    };
};
