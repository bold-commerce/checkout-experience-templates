import {
    IBatchableRequest,
    apiTypeKeys
} from '@boldcommerce/checkout-frontend-library';
import {IOrderInitialization} from 'src/types';

export function getPayloadForGetShippingLines(hasShippingRequest: boolean, getState: () => IOrderInitialization): IBatchableRequest | null {
    const requiresShipping = getState().data.initial_data.requires_shipping;
    if (requiresShipping && hasShippingRequest) {
        return {apiType: apiTypeKeys.getShippingLines, payload: {}};
    } else {
        return null;
    }
}
