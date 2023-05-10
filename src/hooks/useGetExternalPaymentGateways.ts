import {useAppSelector} from 'src/hooks';
import {IExternalPaymentGateway} from '@boldcommerce/checkout-frontend-library';

export function useGetExternalPaymentGateways(location: string): Array<IExternalPaymentGateway> {
    return useAppSelector((state) => state.data.initial_data.external_payment_gateways)
        .filter(external_payment_gateways => external_payment_gateways.location === location);
}

export function useGetExternalPaymentGatewayLoading(gateway: IExternalPaymentGateway): boolean {
    return useAppSelector((state) => Boolean(state.externalPaymentGateways.isLoading.has(gateway.public_id)));
}

export function useGetExternalPaymentGatewayReady(gateway: IExternalPaymentGateway): boolean {
    return useAppSelector((state) => state.externalPaymentGateways.isValid.has(gateway.public_id));
}