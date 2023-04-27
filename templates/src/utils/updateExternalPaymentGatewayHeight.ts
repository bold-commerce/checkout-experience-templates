import {getExternalPaymentGateway} from 'src/utils/getExternalPaymentGateway';

export function updateExternalPaymentGatewayHeight(height: string, paymentGatewayId: string): void {
    const element = getExternalPaymentGateway(paymentGatewayId);
    if(element) {
        element.style.height = height;
    }
}
