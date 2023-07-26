import {IMetaPaymentOptions} from 'src/themes/flow-sdk/types';
import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';

export function metaBuildPaymentOptions(): IMetaPaymentOptions {
    const {general_settings: {checkout_process: {phone_number_required: phoneNumberRequired}}} = getOrderInitialData();
    return {
        allowOfferCodes: false,
        requestBillingAddress: true,
        requestPayerEmail: true,
        requestPayerPhone: phoneNumberRequired,
        requestShipping: true,
        billingAddressMode: 'FULL',
        fulfillmentType: 'SHIPPING'
    };
}
