import {
    IEpsInitialData,
    IOnUpdateVisuals,
    IOrderInitialization,
    IPaymentsCallbacks
} from 'src/types';
import {Dispatch} from 'redux';
import {HistoryLocationState} from 'react-router';
import {onApprovePaymentOrder, onCreatePaymentOrder, onUpdatePaymentOrder, onRequireOrderData, onScaPaymentOrder, onDeletePaymentMethod, onUpdateVisuals} from 'src/eps';
import {actionEpsBoldPayment} from 'src/action';
import {logError} from 'src/utils';

export function initEpsPaymentSdk(history: HistoryLocationState) {
    return async function initEpsPaymentSdkThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const epsGateways = getState().data.initial_data.eps_gateways;
        const shopDomain = window.shopAlias;

        const envType = window.environment.type;
        const epsUrlTest = window.epsUrl || 'https://eps.secure.staging.boldcommerce.com';
        const epsBucketUrlTest = window.epsBucketUrl || 'https://static-eps.secure.staging.boldcommerce.com';

        const epsUrlByEnvironment = envType === 'production' ? 'https://eps.secure.boldcommerce.com' : epsUrlTest;
        const epsBucketUrlByEnvironment = envType === 'production' ? 'https://static-eps.secure.boldcommerce.com' : epsBucketUrlTest;
        const publicOrderId = window.publicOrderId;

        const gatewayIds = Object.keys(epsGateways);
        const mappedEpsGateways = gatewayIds.map((g: string) => {
            return {
                'gateway_id': parseInt(g, 10),
                'auth_token': epsGateways[g].auth_token,
                'currency': epsGateways[g].currency,
                'vaulted_payment_methods': epsGateways[g].vaulted_payment_methods,
            };
        });

        const callbacks: IPaymentsCallbacks = {
            onApprovePaymentOrder: (type, paymentInfo, payload) => onApprovePaymentOrder(dispatch, history, type, paymentInfo, payload),
            onCreatePaymentOrder: onCreatePaymentOrder,
            onScaPaymentOrder: (type, payload) => onScaPaymentOrder(dispatch, type, payload),
            onRequireOrderData: onRequireOrderData,
            onUpdatePaymentOrder: onUpdatePaymentOrder,
            onDeletePaymentMethod: onDeletePaymentMethod,
            onUpdateVisuals: (payload: IOnUpdateVisuals) => onUpdateVisuals(dispatch, payload),
        };

        const initialData: IEpsInitialData = {
            'eps_url': epsUrlByEnvironment,
            'eps_bucket_url': epsBucketUrlByEnvironment,
            'group_label': shopDomain,
            'trace_id': publicOrderId,
            'payment_gateways': mappedEpsGateways,
            'callbacks': callbacks
        };
        const boldPayments = new window.bold.Payments(initialData);
        dispatch(actionEpsBoldPayment(boldPayments));

        try {
            await boldPayments.initialize;
        } catch (e) {
            if (e instanceof Error) {
                logError(e);
            } else {
                logError(new Error(e as string));
            }
        }
    };
}
