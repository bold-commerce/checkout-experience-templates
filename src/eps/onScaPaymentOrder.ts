import {
    IGatewayType,
    IOnScaPaymentOrderPayload,
    IOnScaPaymentOrderResponse
} from 'src/types';
import {Dispatch} from 'redux';
import {displayOrderProcessingScreen} from 'src/library';

export async function onScaPaymentOrder(dispatch: Dispatch, type: IGatewayType, payload: IOnScaPaymentOrderPayload): Promise<IOnScaPaymentOrderResponse> {
    const env = window.environment;
    const shopId = window.shopIdentifier;
    const publicOrderId = window.publicOrderId;
    const path = '/payments/on_sca';
    const url = `${env.url}/${env.path}/storefront/${shopId}/${publicOrderId}${path}`;
    const orderId = payload.order_id;
    const jwtToken = (window.initializedOrder && window.initializedOrder.data && window.initializedOrder.data.jwt_token) ? window.initializedOrder.data.jwt_token : '';

    switch (type) {
        case 'ppcp': {
            const scaResult = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}`},
                body: JSON.stringify({'order_id': orderId, 'public_order_id': publicOrderId, 'gateway_type': 'ppcp'}),
            });
            if (!scaResult.ok) {
                throw new Error('SCA failed');
            }

            const data = await scaResult.json();
            dispatch(displayOrderProcessingScreen);

            return {card: data};
        }
        case 'stripe':
        case 'braintree': {
            dispatch(displayOrderProcessingScreen);

            return {card: {}};
        }
        default:
            throw new Error('Unsupported payment type');
    }
}

