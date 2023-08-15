import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data: {initial_data}} = defaultOrderInitialization;

export function requiresShippingDataReducer(state = initial_data.requires_shipping): boolean {
    return state;
}
