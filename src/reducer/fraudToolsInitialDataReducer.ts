import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IFraudTool} from '@boldcommerce/checkout-frontend-library';

const {data:{initial_data}} = defaultOrderInitialization;

export function fraudToolsInitialDataReducer(state = initial_data.fraud_tools): Array<IFraudTool> {
    return state;
}
