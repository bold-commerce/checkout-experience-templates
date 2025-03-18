import {
    IBatchableRequest,
    apiTypeKeys
} from '@boldcommerce/checkout-frontend-library';

export function getPayloadForGenerateTaxes(hasShippingRequest: boolean): IBatchableRequest | null {
    if (hasShippingRequest) {
        return {apiType: apiTypeKeys.setTaxes, payload: {}};
    } else {
        return null;
    }
}
