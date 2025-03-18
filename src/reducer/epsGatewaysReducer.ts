import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IEpsGateway} from '@boldcommerce/checkout-frontend-library';

const {data:{initial_data}} = defaultOrderInitialization;

export function epsGatewaysReducer(state = initial_data.eps_gateways): Record<string, IEpsGateway> {
    return state;
}
