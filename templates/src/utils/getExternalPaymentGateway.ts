export function getExternalPaymentGateway(paymentGatewayId: string): HTMLElement | null{
    return document.getElementById(paymentGatewayId);
}

